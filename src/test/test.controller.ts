import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Controller('test')
export class TestController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async test() {}
}
