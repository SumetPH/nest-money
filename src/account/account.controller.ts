import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(Number(id));
  }

  @Post()
  create(@Body() accountDto: CreateAccountDto) {
    return this.accountService.create(accountDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() accountDto: CreateAccountDto) {
    return this.accountService.update(accountDto, Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(Number(id));
  }

  @Get('credit-summary/:id')
  accountCreditSummary(@Param('id') id: string) {
    return this.accountService.accountCreditSummary({ id: Number(id) });
  }
}
