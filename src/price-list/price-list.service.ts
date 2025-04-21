import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { PriceList } from '../entities/price-list.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { Product } from '../entities/product.entity';
import { CreatePriceListDto } from "./dto/create-price-list.dto";
import { UpdatePriceListDto } from "./dto/update-price-list.dto";

@Injectable()
export class PriceListService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PriceList)
    private priceListRepository: Repository<PriceList>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createPriceListDto: CreatePriceListDto): Promise<PriceList> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // Валидация цены
      if (!this.isValidPrice(createPriceListDto.price)) {
        throw new BadRequestException('Некорректное значение цены');
      }

      // Поиск или создание производителя
      let manufacturer = await manager.findOne(Manufacturer, {
        where: { name: createPriceListDto.manufacturer }
      });

      if (!manufacturer) {
        manufacturer = manager.create(Manufacturer, {
          name: createPriceListDto.manufacturer,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан'
        });
        manufacturer = await manager.save(manufacturer);
      }

      // Поиск или создание продукта
      let product = await manager.findOne(Product, {
        where: {
          name: createPriceListDto.productName,
          manufacturer: { id: manufacturer.id }
        }
      });

      if (!product) {
        product = manager.create(Product, {
          name: createPriceListDto.productName,
          price: createPriceListDto.price,
          group: createPriceListDto.group,
          number: 'не указан',
          count: 0,
          manufacturer: manufacturer
        });
        product = await manager.save(product);
      }

      // Создание прайс-листа
      const priceList = manager.create(PriceList, {
        price: createPriceListDto.price,
        productName: createPriceListDto.productName,
        group: createPriceListDto.group,
        product: product,
        manufacturer: manufacturer
      });

      return manager.save(priceList);
    });
  }

  async findAll(): Promise<PriceList[]> {
    return this.priceListRepository.find({
      relations: ['manufacturer', 'product'],
      order: { id: 'ASC' }
    });
  }

  async findOne(id: number): Promise<PriceList> {
    const priceList = await this.priceListRepository.findOne({
      where: { id },
      relations: ['manufacturer', 'product']
    });

    if (!priceList) {
      throw new NotFoundException(`Прайс-лист с ID ${id} не найден`);
    }

    return priceList;
  }

  async update(id: number, updatePriceListDto: UpdatePriceListDto): Promise<PriceList> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const priceList = await this.findOne(id);
      let needsUpdate = false;

      // Обновление производителя при необходимости
      if (updatePriceListDto.manufacturer && updatePriceListDto.manufacturer !== priceList.manufacturer.name) {
        let manufacturer = await manager.findOne(Manufacturer, {
          where: { name: updatePriceListDto.manufacturer }
        });

        if (!manufacturer) {
          manufacturer = manager.create(Manufacturer, {
            name: updatePriceListDto.manufacturer,
            address: 'Не указан',
            phone: 'Не указан',
            directorName: 'Не указан'
          });
          manufacturer = await manager.save(manufacturer);
        }

        priceList.manufacturer = manufacturer;
        needsUpdate = true;
      }

      // Обновление продукта при необходимости
      if (updatePriceListDto.productName && updatePriceListDto.productName !== priceList.productName) {
        let product = await manager.findOne(Product, {
          where: {
            name: updatePriceListDto.productName,
            manufacturer: { id: priceList.manufacturer.id }
          }
        });

        if (!product) {
          product = manager.create(Product, {
            name: updatePriceListDto.productName,
            price: updatePriceListDto.price || priceList.price,
            group: updatePriceListDto.group || priceList.group,
            number: 'не указан',
            count: 0,
            manufacturer: priceList.manufacturer
          });
          product = await manager.save(product);
        }

        priceList.product = product;
        priceList.productName = updatePriceListDto.productName;
        needsUpdate = true;
      }

      // Обновление группы
      if (updatePriceListDto.group && updatePriceListDto.group !== priceList.group) {
        priceList.group = updatePriceListDto.group;
        needsUpdate = true;
      }

      // Обновление цены
      if (updatePriceListDto.price) {
        if (!this.isValidPrice(updatePriceListDto.price)) {
          throw new BadRequestException('Некорректное значение цены');
        }
        priceList.price = updatePriceListDto.price;
        needsUpdate = true;
      }

      if (needsUpdate) {
        return manager.save(priceList);
      }

      return priceList;
    });
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Находим прайс-лист с связанными сущностями
      const priceList = await queryRunner.manager.findOne(PriceList, {
        where: { id },
        relations: ['product', 'manufacturer']
      });

      if (!priceList) {
        throw new NotFoundException(`Прайс-лист с ID ${id} не найден`);
      }

      // 2. Удаляем сам прайс-лист
      await queryRunner.manager.delete(PriceList, { id });

      // 3. Проверяем, есть ли другие прайс-листы для этого товара
      const otherPriceLists = await queryRunner.manager.count(PriceList, {
        where: { product: { id: priceList.product.id } }
      });

      // 4. Если это был последний прайс-лист для товара, удаляем и товар
      if (otherPriceLists === 0) {
        await queryRunner.manager.delete(Product, { id: priceList.product.id });

        // 5. Проверяем, есть ли другие товары у производителя
        const otherProducts = await queryRunner.manager.count(Product, {
          where: { manufacturer: { id: priceList.manufacturer.id } }
        });

        // 6. Если это был последний товар производителя, удаляем и производителя
        if (otherProducts === 0) {
          await queryRunner.manager.delete(Manufacturer, { id: priceList.manufacturer.id });
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private isValidPrice(price: string): boolean {
    const numberValue = parseFloat(price);
    return !isNaN(numberValue) && numberValue >= 0;
  }
}
