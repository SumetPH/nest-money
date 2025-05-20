import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}
