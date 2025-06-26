import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  UpdateAccountDto,
  UpdateAccountSortDto,
} from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  findAll(@Query('showHidden') showHidden: string) {
    return this.accountService.findAll({
      showHidden: showHidden === 'true' ? true : false,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(Number(id));
  }

  @Post()
  create(@Body() accountDto: CreateAccountDto) {
    return this.accountService.create(accountDto);
  }

  @Post('/sort')
  updateSort(@Body() body: UpdateAccountSortDto) {
    return this.accountService.updateSort(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() accountDto: UpdateAccountDto) {
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
