import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Post('create')
    createrCategory(@Body() dto: CategoryDto) {
        return this.categoryService.createCategory(dto);
    }

    @Get(':id')
    getCategory(@Param('id') id: string) {
        return this.categoryService.getCategory(id);
    }
}
