import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtGuard } from '../auth/guard';


@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get('all')
    async index() {
        return await this.productService.findAll();
    }
}
