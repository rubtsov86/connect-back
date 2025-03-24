import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Company])],
  controllers: [CompanyController],
  providers: [CompanyService, TokenService],
  exports: [CompanyService],
})
export class CompanyModule {}
