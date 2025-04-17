import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceList } from '../entities/price-list.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePriceListDto } from "./dto/create-price-list.dto";
import { UpdatePriceListDto } from "./dto/update-price-list.dto";

@ApiTags('Прайс-листы')
@Controller('price-lists')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Post()
  @ApiOperation({
    summary: 'Создать прайс-лист',
    description: 'Автоматически создает производителя и товар, если они не существуют'
  })
  @ApiResponse({ status: 201, type: PriceList })
  create(@Body() dto: CreatePriceListDto): Promise<PriceList> {
    return this.priceListService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все прайс-листы' })
  @ApiResponse({ status: 200, type: [PriceList] })
  findAll(): Promise<PriceList[]> {
    return this.priceListService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить прайс-лист по ID' })
  @ApiResponse({ status: 200, type: PriceList })
  @ApiResponse({ status: 404, description: 'Прайс-лист не найден' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PriceList> {
    return this.priceListService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить прайс-лист' })
  @ApiResponse({ status: 200, type: PriceList })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePriceListDto,
  ): Promise<PriceList> {
    return this.priceListService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить прайс-лист' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Прайс-лист не найден' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.priceListService.remove(id);
  }
}
