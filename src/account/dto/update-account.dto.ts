import { AccountType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  type?: AccountType;

  @IsOptional()
  @IsNumber()
  credit_date?: number;

  @IsOptional()
  @IsBoolean()
  is_hidden?: boolean;

  @IsOptional()
  @IsDateString()
  created_at?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;
}

class AccountSortDto {
  @IsNumber()
  id: number;

  @IsNumber()
  sort: number;
}

export class UpdateAccountSortDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccountSortDto)
  sort: AccountSortDto[];
}
