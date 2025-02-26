import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async createProduct(dto: ProductDto, file: Express.Multer.File) {
    console.log('test');
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    //validate file type
    const fileType = ['image/jpeg', 'image/jpg', 'image/png'];

    //validate category exists
    const category = await this.prisma.category.findUnique({
      where: {
        id: dto.category_id,
      },
    });

    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    const imageUrl = `/uploads/products/${file.filename}`;

    const product = await this.prisma.product.create({
      data: {
        name: dto.productName,
        description: dto.productDesc,
        price: dto.productPrice,
        stock: dto.productStock,
        image_url: imageUrl,
        category: {
          connect: {
            id: dto.category_id,
          },
        },
      },
      include: {
        category: true,
      },
    });

    console.log(product);

    return product;
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });

    return product;
  }
}
