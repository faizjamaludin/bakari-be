import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
    return await this.productService.getAllProduct();
  }

  @Get('/product/:id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Get('cookies')
  async getCookies(@Req() req) {
    console.log(req.cookies);
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
