import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { TokenService } from './token.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { ICompany } from '../company/company.types';
import { User } from '../company/company.decorator';

import { Response, Request } from 'express';
import { createCompanyReqDto } from './dto';
import { MoreThanOrEqual } from 'typeorm';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: createCompanyReqDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    // crypt the password
    const cryptPassword = await bcryptjs.hash(body.password, 12);
    const newCompany = Object.assign(body, {
      password: cryptPassword,
      isActive: true,
    });

    return this.companyService.save(newCompany);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const company = await this.companyService.findOne({ email });

    if (!company || !company.isActive) {
      throw new BadRequestException('invalid credentials');
    }

    if (!(await bcryptjs.compare(password, company.password))) {
      throw new BadRequestException('invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        id: company.id,
      },
      { expiresIn: '1d' },
    );
    console.log('qwe');
    const refreshToken = await this.jwtService.signAsync({
      id: company.id,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await this.tokenService.save({
      userId: company.id,
      token: refreshToken,
      expired_at,
    });

    response.status(200);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      token: accessToken,
    };
  }

  @Post('refresh')
  async refrech(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refrechToken = request.cookies['refresh_token'];
      const { id } = await this.jwtService.verifyAsync(refrechToken);

      const tokenEntity = await this.tokenService.findOne({
        user_id: id,
        expired_at: MoreThanOrEqual(new Date()),
      });

      if (!tokenEntity) {
        throw new UnauthorizedException('user is Unauthorized');
      }

      const accessToken = await this.jwtService.signAsync(
        { id },
        { expiresIn: '1d' },
      );
      response.status(200);
      return {
        token: accessToken,
      };
    } catch (e) {
      throw new UnauthorizedException('user is Unauthorized');
    }
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.tokenService.delete({ token: request.cookies['refresh_token'] });

    response.clearCookie('refresh_token');

    return {
      message: 'success',
    };
  }
}
