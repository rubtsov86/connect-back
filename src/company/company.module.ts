import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Company } from './company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Company])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CompanyModule {}
