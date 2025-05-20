import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll({ q, type }: { q: string; type: string }) {
    try {
      return await this.prisma.category.findMany({
        where: {
          parent_id: null,
          AND: [
            {
              title: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              type: type as CategoryType,
            },
          ],
        },
        include: {
          children: true,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error as Error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
