// src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/swagger'; // или из '@nestjs/mapped-types' если старая версия
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
