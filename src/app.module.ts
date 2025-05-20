import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { BudgetModule } from './budget/budget.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [AccountModule, TransactionModule, CategoryModule, BudgetModule, TestModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
