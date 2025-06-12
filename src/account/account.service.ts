import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const account = await this.prisma.account.findMany({
        where: {
          is_hidden: false,
        },
        include: {
          transaction: true,
        },
        orderBy: {
          title: 'asc',
        },
      });

      const accountList = account.map((acc) => ({
        id: acc.id,
        title: acc.title,
        created_at: acc.created_at,
        updated_at: acc.updated_at,
        type: acc.type,
        credit_date: acc.credit_date,
        is_hidden: acc.is_hidden,
        balance: acc.transaction
          .reduce((p, c) => p + c.amount.toNumber(), 0)
          .toFixed(2),
      }));

      const cash = {
        title: 'เงินสด',
        balance: '0',
        list: [] as typeof accountList,
      };
      const bank = {
        title: 'ธนาคาร',
        balance: '0',
        list: [] as typeof accountList,
      };
      const credit = {
        title: 'เครดิต',
        balance: '0',
        list: [] as typeof accountList,
      };
      const saving = {
        title: 'เงินเก็บ',
        balance: '0',
        list: [] as typeof accountList,
      };
      const debt = {
        title: 'หนี้สิน',
        balance: '0',
        list: [] as typeof accountList,
      };

      for (const acc of accountList) {
        if (acc.type === 'cash') {
          cash.list.push(acc);
          cash.balance = (Number(cash.balance) + Number(acc.balance)).toFixed(
            2,
          );
        }
        if (acc.type === 'bank') {
          bank.list.push(acc);
          bank.balance = (Number(bank.balance) + Number(acc.balance)).toFixed(
            2,
          );
        }
        if (acc.type === 'credit') {
          credit.list.push(acc);
          credit.balance = (
            Number(credit.balance) + Number(acc.balance)
          ).toFixed(2);
        }
        if (acc.type === 'saving') {
          saving.list.push(acc);
          saving.balance = (
            Number(saving.balance) + Number(acc.balance)
          ).toFixed(2);
        }
        if (acc.type === 'debt') {
          debt.list.push(acc);
          debt.balance = (Number(debt.balance) + Number(acc.balance)).toFixed(
            2,
          );
        }
      }

      return [cash, bank, credit, saving, debt];
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.account.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(accountDto: CreateAccountDto) {
    try {
      const accountLastId = await this.prisma.account.findFirst({
        orderBy: {
          id: 'desc',
        },
      });

      return this.prisma.account.create({
        data: {
          id: accountLastId ? accountLastId.id + 1 : 1,
          title: accountDto.title,
          type: accountDto.type,
          credit_date: accountDto.credit_date,
          is_hidden: accountDto.is_hidden,
          created_at:
            dayjs(accountDto.created_at).toISOString() ?? dayjs().toDate(),
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(accountDto: CreateAccountDto, id: number) {
    try {
      return await this.prisma.account.update({
        where: {
          id: id,
        },
        data: {
          title: accountDto.title,
          type: accountDto.type,
          credit_date: accountDto.credit_date,
          is_hidden: accountDto.is_hidden,
          created_at: accountDto.created_at ?? new Date(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.account.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async accountCreditSummary({ id }: { id: number }) {
    try {
      const account = await this.prisma.account.findFirst({
        where: {
          id: id,
          type: 'credit',
        },
      });

      if (!account) {
        throw new HttpException('account not found', HttpStatus.NOT_FOUND);
      }

      if (!account.credit_date) {
        throw new HttpException('credit date not found', HttpStatus.NOT_FOUND);
      }

      const creditDate = account.credit_date;
      const dateEnd = account.created_at;

      let startDatePeriod =
        dayjs.utc().get('date') < creditDate
          ? dayjs
              .utc()
              .startOf('month')
              .subtract(1, 'month')
              .set('date', creditDate)
          : dayjs.utc().startOf('month').set('date', creditDate);

      const list: {
        startDatePeriod: string;
        endDatePeriod: string;
      }[] = [];

      while (startDatePeriod.add(1, 'month') > dayjs(dateEnd)) {
        list.push({
          startDatePeriod: startDatePeriod.format('YYYY-MM-DD'),
          endDatePeriod: startDatePeriod
            .add(1, 'month')
            .subtract(1, 'day')
            .format('YYYY-MM-DD'),
        });

        startDatePeriod = startDatePeriod.subtract(1, 'month');
      }

      const data: {
        startDatePeriod: string;
        endDatePeriod: string;
        expense: string;
        income: string;
        // payOffDebt: string;
        balance: string;
      }[] = [];

      let totalDebt = 0;

      for (const l of list.reverse()) {
        const expense = await this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            account_id: account.id,
            created_at: {
              gte: dayjs.utc(l.startDatePeriod).toDate(),
              lt: dayjs
                .utc(l.endDatePeriod)
                .add(23, 'hour')
                .add(59, 'minute')
                .add(59, 'second')
                .toDate(),
            },
            amount: {
              lt: 0,
            },
          },
        });

        const income = await this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            account_id: account.id,
            created_at: {
              gte: dayjs.utc(l.startDatePeriod).toDate(),
              lt: dayjs
                .utc(l.endDatePeriod)
                .add(23, 'hour')
                .add(59, 'minute')
                .add(59, 'second')
                .toDate(),
            },
            amount: {
              gte: 0,
            },
          },
        });

        const payOffDebt = await this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            account_id: account.id,
            created_at: {
              gte: dayjs.utc(l.startDatePeriod).add(1, 'month').toDate(),
              lt: dayjs
                .utc(l.endDatePeriod)
                .add(1, 'month')
                .add(23, 'hour')
                .add(59, 'minute')
                .add(59, 'second')
                .toDate(),
            },
            amount: {
              gte: 0,
            },
          },
        });

        const expenseValue = expense._sum.amount?.toNumber() ?? 0;
        const incomeValue = income._sum.amount?.toNumber() ?? 0;
        const payOffDebtValue = payOffDebt._sum.amount?.toNumber() ?? 0;

        const balance = expenseValue + payOffDebtValue + totalDebt;
        totalDebt = balance;

        data.unshift({
          startDatePeriod: l.startDatePeriod,
          endDatePeriod: l.endDatePeriod,
          expense: expenseValue.toFixed(2),
          income: incomeValue.toFixed(2),
          balance: balance.toFixed(2),
        });
      }

      return data;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
