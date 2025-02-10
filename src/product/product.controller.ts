import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto';

@UseGuards(JwtGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  async index() {
    return await this.productService.findAll();
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('img'))
  async createProduct(
    @Body() dto: ProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productService.createProduct(dto, file);
  }
}
