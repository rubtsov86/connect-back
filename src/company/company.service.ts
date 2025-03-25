import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async save(body: Partial<Company>) {
    return this.companyRepository.save(body);
  }

  async findOne(options: Partial<Company>) {
    return this.companyRepository.findOne({
      where: options,
    });
  }
}
