import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsString()
    @IsNotEmpty()
    image_url: string;

    @IsNumber()
    @IsNotEmpty()
    category_id: number;
}   