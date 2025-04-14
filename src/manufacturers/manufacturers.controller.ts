import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { Manufacturer } from '../entities/manufacturer.entity';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  create(
    @Body() createManufacturerDto: CreateManufacturerDto,
  ): Promise<Manufacturer> {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Get()
  findAll(): Promise<Manufacturer[]> {
    return this.manufacturersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Manufacturer> {
    return this.manufacturersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.manufacturersService.remove(id);
  }
}
