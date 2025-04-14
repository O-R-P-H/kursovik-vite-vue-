import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  providers: [ManufacturersService],
  controllers: [ManufacturersController],
  exports: [TypeOrmModule], // Важно: экспортируем TypeOrmModule
})
export class ManufacturersModule {}
