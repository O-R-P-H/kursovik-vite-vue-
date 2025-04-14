import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Manufacturer } from '../entities/manufacturer.entity'; // Добавляем импорт
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Manufacturer]), // Добавляем Manufacturer
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
