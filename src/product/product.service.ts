import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const products = await this.prisma.product.findMany();
        return products
    }

    async createProduct(dto: ProductDto) {
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                price: dto.price,
                stock: dto.stock,
                image_url: dto.image_url,
                category: {
                    connect: {
                        id: dto.category_id
                    }
                }

            }
        });
        return product;
    }
}
