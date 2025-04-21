import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { PriceList } from '../entities/price-list.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturersRepository: Repository<Manufacturer>,
    private dataSource: DataSource
  ) {}

  async create(
    createManufacturerDto: CreateManufacturerDto,
  ): Promise<Manufacturer> {
    const manufacturer = this.manufacturersRepository.create(
      createManufacturerDto,
    );
    return this.manufacturersRepository.save(manufacturer);
  }

  async findAll(): Promise<Manufacturer[]> {
    return this.manufacturersRepository.find({
      relations: ['products', 'priceLists'],
      order: { id: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Manufacturer> {
    const manufacturer = await this.manufacturersRepository.findOne({
      where: { id },
      relations: ['products', 'priceLists']
    });

    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with ID ${id} not found`);
    }

    return manufacturer;
  }

  async update(
    id: number,
    updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    await this.manufacturersRepository.update(id, updateManufacturerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Удаляем связанные прайс-листы
      await queryRunner.manager.delete(PriceList, { manufacturer: { id } });

      // 2. Удаляем связанные продукты
      await queryRunner.manager.delete(Product, { manufacturer: { id } });

      // 3. Удаляем производителя
      await queryRunner.manager.delete(Manufacturer, { id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
