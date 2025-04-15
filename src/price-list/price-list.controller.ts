import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceList } from '../entities/price-list.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreatePriceListDto } from "./dto/create-price-list.dto";
import { UpdatePriceListDto } from "./dto/update-price-list.dto";

@ApiTags('Price Lists')
@Controller('price-lists')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Post()
  create(@Body() dto: CreatePriceListDto): Promise<PriceList> {
    return this.priceListService.create(dto);
  }

  @Get()
  findAll(): Promise<PriceList[]> {
    return this.priceListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PriceList> {
    return this.priceListService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePriceListDto,
  ): Promise<PriceList> {
    return this.priceListService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.priceListService.remove(id);
  }
}
