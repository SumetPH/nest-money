import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto) {
    try {
      const newBudget = await this.prisma.budget.create({
        data: {
          title: createBudgetDto.title,
          amount: createBudgetDto.amount,
          start_date: createBudgetDto.start_date,
          created_at: createBudgetDto.created_at ?? new Date(),
        },
      });

      if (createBudgetDto.account) {
        await this.prisma.budgetAccount.createMany({
          data: createBudgetDto.account.map((acc) => ({
            budget_id: newBudget.id,
            account_id: acc,
          })),
        });
      }

      if (createBudgetDto.category) {
        await this.prisma.budgetCategory.createMany({
          data: createBudgetDto.category.map((cat) => ({
            budget_id: newBudget.id,
            category_id: cat,
          })),
        });
      }

      return newBudget;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const budgetList = await this.prisma.budget.findMany({
        select: {
          id: true,
          title: true,
          amount: true,
          created_at: true,
          start_date: true,
          budgetAccount: {
            select: {
              account: true,
            },
          },
          budgetCategory: {
            select: {
              category: true,
            },
          },
        },
      });

      const data: typeof budgetList & { sum: string }[] = [];

      for (const budget of budgetList) {
        const sum = await this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            account_id:
              budget.budgetAccount.length > 0
                ? {
                    in: budget.budgetAccount.map((acc) => acc.account.id),
                  }
                : undefined,
            category_id: {
              in: budget.budgetCategory.map((cat) => cat.category.id),
            },
            created_at: {
              gte:
                dayjs().date() >= budget.start_date
                  ? dayjs()
                      .utc()
                      .startOf('month')
                      .add(budget.start_date - 1, 'day')
                      .toDate()
                  : dayjs()
                      .utc()
                      .startOf('month')
                      .subtract(1, 'month')
                      .add(budget.start_date - 1, 'day')
                      .toDate(),
            },
          },
        });

        data.push({
          ...budget,
          sum: sum._sum.amount?.toFixed(2) ?? '0.00',
        });
      }

      return data;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
