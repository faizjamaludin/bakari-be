import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CategoryDto) {
    const name = this.formatWordUpperCase(dto.name);
    const category = await this.prisma.category.create({
      data: {
        name: name,
      },
    });
    return category;
  }

  async getCategories() {
    const category = await this.prisma.category.findMany({
      include: {
        products: true,
      },
    });

    return category;
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    return category;
  }

  formatWordUpperCase(word: string) {
    return word
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
