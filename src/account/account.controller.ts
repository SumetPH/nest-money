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

  @Post()
  create(@Body() accountDto: CreateAccountDto) {
    return this.accountService.create(accountDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() accountDto: CreateAccountDto) {
    return this.accountService.update(accountDto, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Get('credit-summary/:id')
  accountCreditSummary(@Param('id') id: string) {
    return this.accountService.accountCreditSummary({ id: +id });
  }
}
