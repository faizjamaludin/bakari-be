import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  productDesc: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  productPrice: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  productStock: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
