// products.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { PriceList } from '../entities/price-list.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

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
      relations: ['manufacturer'],
      order: { id: 'ASC' }
    });
  }


  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['manufacturer', 'priceLists'],
    });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // Проверка цены
      if (!this.isValidPrice(createProductDto.price)) {
        throw new BadRequestException('Некорректное значение цены');
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
          directorName: 'Не указан',
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
        manufacturer: manufacturer,
      });

      const savedProduct = await manager.save(product);

      // Создание прайс-листа
      const priceList = manager.create(PriceList, {
        price: createProductDto.price,
        productName: createProductDto.name,
        group: createProductDto.group,
        product: savedProduct,
        manufacturer: manufacturer,
      });

      await manager.save(priceList);

      return savedProduct;
    });
  }



  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const product = await this.findOne(id);
      let needsUpdate = false;

      if (updateProductDto.manufacturer && updateProductDto.manufacturer !== product.manufacturer.name) {
        let manufacturer = await manager.findOne(Manufacturer, {
          where: { name: updateProductDto.manufacturer }
        });

        if (!manufacturer) {
          manufacturer = manager.create(Manufacturer, {
            name: updateProductDto.manufacturer,
            address: 'Не указан',
            phone: 'Не указан',
            directorName: 'Не указан',
          });
          manufacturer = await manager.save(manufacturer);
        }
        product.manufacturer = manufacturer;
        needsUpdate = true;
      }

      if (updateProductDto.name && updateProductDto.name !== product.name) {
        product.name = updateProductDto.name;
        needsUpdate = true;
      }

      if (updateProductDto.count !== undefined && updateProductDto.count !== product.count) {
        product.count = updateProductDto.count;
        needsUpdate = true;
      }

      if (updateProductDto.group && updateProductDto.group !== product.group) {
        product.group = updateProductDto.group;
        needsUpdate = true;
      }

      if (updateProductDto.number && updateProductDto.number !== product.number) {
        product.number = updateProductDto.number;
        needsUpdate = true;
      }

      if (updateProductDto.price && updateProductDto.price !== product.price) {
        if (!this.isValidPrice(updateProductDto.price)) {
          throw new BadRequestException('Некорректное значение цены');
        }
        product.price = updateProductDto.price;
        needsUpdate = true;
      }

      if (needsUpdate) {
        const updatedProduct = await manager.save(product);

        if (updateProductDto.name || updateProductDto.group || updateProductDto.price) {
          const priceList = await manager.findOne(PriceList, {
            where: { product: { id: product.id } }
          });

          if (priceList) {
            if (updateProductDto.name) priceList.productName = updateProductDto.name;
            if (updateProductDto.group) priceList.group = updateProductDto.group;
            if (updateProductDto.price) priceList.price = updateProductDto.price;
            await manager.save(priceList);
          }
        }

        return updatedProduct;
      }

      return product;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
  }

  private isValidPrice(price: string): boolean {
    const numberValue = parseFloat(price);
    return !isNaN(numberValue) && numberValue >= 0;
  }
}
