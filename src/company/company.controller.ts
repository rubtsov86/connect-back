import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { TokenService } from './token.service';
import { Token } from './token.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { Response, Request } from 'express';
import { createCompanyReqDto } from './dto';
import { MoreThanOrEqual } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { IUser } from './user.types';
import { User } from './company.decorator';

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
  @ApiCreatedResponse({
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Password do not match!' })
  async register(@Body() body: createCompanyReqDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Password do not match!');
    }

    const { password_confirm, ...data } = body;
    // crypt the password
    const cryptPassword = await bcryptjs.hash(body.password, 12);
    const newCompany = Object.assign(data, {
      password: cryptPassword,
      isActive: true,
    });

    const { password, ...response } =
      await this.companyService.save(newCompany);

    return response;
  }

  @Post('login')
  @ApiResponse({ status: 200, type: Token })
  @ApiBadRequestResponse({ description: 'invalid credentials' })
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
  @ApiResponse({ status: 200, type: Token })
  @ApiUnauthorizedResponse({ description: 'user is Unauthorized' })
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
  @ApiResponse({ status: 200, description: 'success' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.tokenService.delete({ token: request.cookies['refresh_token'] });

    response.status(200).clearCookie('refresh_token');

    return {
      message: 'success',
    };
  }

  @Get('user')
  @ApiResponse({
    status: 200,
    type: Company,
  })
  @ApiUnauthorizedResponse({ description: 'user is Unauthorized' })
  @UseGuards(AuthGuard)
  async user(@Req() request: Request, @User() user: IUser) {
    try {
      const { password, ...data } = (await this.companyService.findOne({
        id: user.id,
      })) as Company;

      return data;
    } catch (e) {
      throw new UnauthorizedException('user is Unauthorized');
    }
  }

  @Get('/:companyId')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The company',
    type: Company,
  })
  @ApiUnauthorizedResponse({ description: 'user is Unauthorized' })
  async updateCompany(@Param('companyId') companyId: number) {
    return this.companyService.findOne({ id: companyId });
  }
}
