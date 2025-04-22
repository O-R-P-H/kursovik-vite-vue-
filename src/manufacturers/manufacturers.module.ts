import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { Manufacturer } from '../entities/manufacturer.entity';
import { PriceList } from '../entities/price-list.entity';
import { Product } from '../entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manufacturer, PriceList, Product]),
  ],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
