import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  start_date: number;

  @IsOptional()
  @IsArray()
  account: number[];

  @IsOptional()
  @IsArray()
  category: number[];

  @IsOptional()
  @IsDateString()
  created_at?: string;
}
