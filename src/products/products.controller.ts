import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from '../entities/product.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список товаров' })
  @ApiResponse({ status: 200, type: [Product] })
  async findAll(
    @Query('name') name?: string,
    @Query('group') group?: string,
    @Query('manufacturer') manufacturer?: string,
  ): Promise<Product[]> {
    return this.productsService.findAll({ name, group, manufacturer });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiResponse({ status: 200, type: Product })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiResponse({ status: 201, type: Product })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить товар' })
  @ApiResponse({ status: 200, type: Product })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
