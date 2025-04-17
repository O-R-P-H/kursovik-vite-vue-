// products.controller.ts
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
  @ApiOperation({ summary: 'Получить список товаров с прайс-листами' })
  @ApiResponse({
    status: 200,
    description: 'Список товаров с производителями и прайс-листами',
    type: [Product]
  })
  async findAll(
    @Query('name') name?: string,
    @Query('group') group?: string,
    @Query('manufacturer') manufacturer?: string,
  ): Promise<Product[]> {
    return this.productsService.findAll({ name, group, manufacturer });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID с прайс-листами' })
  @ApiResponse({
    status: 200,
    description: 'Товар с производителем и связанными прайс-листами',
    type: Product
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать товар',
    description: 'Автоматически создает производителя и прайс-лист'
  })
  @ApiResponse({
    status: 201,
    description: 'Товар создан вместе с прайс-листом',
    type: Product
  })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить товар' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить товар',
    description: 'Удаляет товар и связанные прайс-листы (каскадно)'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
