import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { PriceList } from '../entities/price-list.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
    @InjectRepository(PriceList)
    private priceListRepository: Repository<PriceList>
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['manufacturer', 'priceList'],
      order: { id: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['manufacturer', 'priceList']
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // Проверка цены
      if (!this.isValidPrice(createProductDto.price)) {
        throw new BadRequestException('Invalid price value');
      }

      // Работа с производителем
      let manufacturer = await manager.findOne(Manufacturer, {
        where: { name: createProductDto.manufacturer }
      });

      if (!manufacturer) {
        manufacturer = manager.create(Manufacturer, {
          name: createProductDto.manufacturer,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан'
        });
        manufacturer = await manager.save(manufacturer);
      }

      // Создание продукта
      const product = manager.create(Product, {
        name: createProductDto.name,
        count: createProductDto.count,
        group: createProductDto.group,
        number: createProductDto.number,
        price: createProductDto.price,
        manufacturer: manufacturer
      });

      const savedProduct = await manager.save(product);

      // Создание прайс-листа
      const priceList = manager.create(PriceList, {
        price: createProductDto.price,
        productName: createProductDto.name,
        group: createProductDto.group,
        product: savedProduct,
        manufacturer: manufacturer
      });

      await manager.save(priceList);

      return savedProduct;
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const product = await this.findOne(id);
      let needsUpdate = false;

      // Обновление производителя
      if (updateProductDto.manufacturer && updateProductDto.manufacturer !== product.manufacturer.name) {
        let manufacturer = await manager.findOne(Manufacturer, {
          where: { name: updateProductDto.manufacturer }
        });

        if (!manufacturer) {
          manufacturer = manager.create(Manufacturer, {
            name: updateProductDto.manufacturer,
            address: 'Не указан',
            phone: 'Не указан',
            directorName: 'Не указан'
          });
          manufacturer = await manager.save(manufacturer);
        }
        product.manufacturer = manufacturer;
        needsUpdate = true;
      }

      // Обновление названия
      if (updateProductDto.name && updateProductDto.name !== product.name) {
        product.name = updateProductDto.name;
        needsUpdate = true;
      }

      // Обновление количества
      if (updateProductDto.count !== undefined && updateProductDto.count !== product.count) {
        product.count = updateProductDto.count;
        needsUpdate = true;
      }

      // Обновление группы
      if (updateProductDto.group && updateProductDto.group !== product.group) {
        product.group = updateProductDto.group;
        needsUpdate = true;
      }

      // Обновление артикула
      if (updateProductDto.number && updateProductDto.number !== product.number) {
        product.number = updateProductDto.number;
        needsUpdate = true;
      }

      // Обновление цены
      if (updateProductDto.price && updateProductDto.price !== product.price) {
        if (!this.isValidPrice(updateProductDto.price)) {
          throw new BadRequestException('Invalid price value');
        }
        product.price = updateProductDto.price;
        needsUpdate = true;
      }

      if (needsUpdate) {
        const updatedProduct = await manager.save(product);

        // Обновление связанного прайс-листа
        const priceList = await manager.findOne(PriceList, {
          where: { product: { id: product.id } }
        });

        if (priceList) {
          if (updateProductDto.name) priceList.productName = updateProductDto.name;
          if (updateProductDto.group) priceList.group = updateProductDto.group;
          if (updateProductDto.price) priceList.price = updateProductDto.price;
          await manager.save(priceList);
        }

        return updatedProduct;
      }

      return product;
    });
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.findOne(id);

      // Удаляем связанные прайс-листы
      await queryRunner.manager.delete(PriceList, { product: { id } });

      // Удаляем продукт
      await queryRunner.manager.delete(Product, { id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private isValidPrice(price: string): boolean {
    const numberValue = parseFloat(price);
    return !isNaN(numberValue) && numberValue >= 0;
  }
}
