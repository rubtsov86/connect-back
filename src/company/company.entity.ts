import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Company {
  @ApiProperty({
    description: 'Id of the company',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'name of the company',
    example: 'AJAX',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'logo url of the company',
    example: 'http://www.example.com/index.html',
  })
  @Column({ nullable: true })
  logoUrl: string;

  @ApiProperty({
    description: 'address of the company',
    example: 'London, Crown Passage, 20 Kings St',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'postcode of the company',
    example: 'SW1Y 6QY',
  })
  @Column()
  postcode: string;

  @ApiProperty({
    description: 'contact number of the company',
    example: '020 7839 8831',
  })
  @Column()
  contact_number: string;

  @ApiProperty({
    description: 'email of the company',
    example: 'example@example.com',
  })
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @ApiProperty({
    description: 'is company active',
    example: true,
  })
  @Column({ nullable: true })
  isActive: boolean;

  @ApiProperty({
    description: 'create date',
    example: '2025-03-25T18:27:04.450Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'update date',
    example: '2025-03-25T18:27:04.450Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
