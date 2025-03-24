import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class createCompanyReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'password',
    example: 'qwerty',
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'password_confirm',
    example: 'qwerty',
  })
  readonly password_confirm: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name of the company',
    example: 'AJAX',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'address of the company',
    example: 'London, Crown Passage, 20 Kings St',
  })
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'postcode of the company',
    example: 'SW1Y 6QY',
  })
  readonly postcode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'contact number of the company',
    example: '020 7839 8831',
  })
  readonly contact_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email of the company',
    example: 'example@example.com',
  })
  readonly email: string;
}
