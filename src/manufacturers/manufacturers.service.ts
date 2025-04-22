import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource,In } from 'typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { PriceList } from "../entities/price-list.entity";
import { Product } from "../entities/product.entity";


@Injectable()
export class ManufacturersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Manufacturer)
    private manufacturersRepository: Repository<Manufacturer>,
    @InjectRepository(PriceList)
    private priceListRepository: Repository<PriceList>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
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
      relations: ['products', 'priceLists']
    });
  }

  async findOne(id: number): Promise<Manufacturer> {
    return this.manufacturersRepository.findOne({
      where: { id },
      relations: ['products', 'priceLists']
    });
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
      // 1. Находим производителя со всеми связями
      const manufacturer = await queryRunner.manager.findOne(Manufacturer, {
        where: { id },
        relations: ['products', 'priceLists']
      });

      if (!manufacturer) {
        throw new NotFoundException(`Производитель с ID ${id} не найден`);
      }

      // 2. Удаляем все связанные прайс-листы
      if (manufacturer.priceLists && manufacturer.priceLists.length > 0) {
        await queryRunner.manager.delete(PriceList, {
          manufacturer: { id }
        });
      }

      // 3. Удаляем все связанные продукты
      if (manufacturer.products && manufacturer.products.length > 0) {
        // Сначала удаляем прайс-листы этих продуктов
        const productIds = manufacturer.products.map(p => p.id);
        await queryRunner.manager.delete(PriceList, {
          product: { id: In(productIds) }
        });

        // Затем удаляем сами продукты
        await queryRunner.manager.delete(Product, {
          manufacturer: { id }
        });
      }

      // 4. Удаляем самого производителя
      await queryRunner.manager.delete(Manufacturer, { id });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
