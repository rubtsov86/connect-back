import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @ApiProperty({
    description: 'token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzQyOTMyNTI1LCJleHAiOjE3NDMwMTg5MjV9._87_6Bk9vStFurhrr8pO8zFoujZdoNaHoJFIlAGJcIE',
  })
  @Column()
  token: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expired_at: Date;
}
