import { AccountType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  title: string;

  @IsString()
  type: AccountType;

  @IsOptional()
  @IsNumber()
  credit_date?: number;

  @IsBoolean()
  is_hidden: boolean;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}
