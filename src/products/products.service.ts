import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { PriceList } from '../entities/price-list.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Manufacturer)
    private manufacturerRepo: Repository<Manufacturer>,
    @InjectRepository(PriceList)
    private priceListRepo: Repository<PriceList>,
  ) {}

  async findAll(query?: {
    name?: string;
    group?: string;
    manufacturer?: string;
  }): Promise<Product[]> {
    const where: any = {};
    if (query?.name) where.name = Like(`%${query.name}%`);
    if (query?.group) where.group = query.group;
    if (query?.manufacturer) {
      where.manufacturer = { name: Like(`%${query.manufacturer}%`) };
    }

    return this.productRepo.find({
      where,
      relations: ['manufacturer', 'priceLists']
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['manufacturer', 'priceLists'],
    });
    if (!product) throw new NotFoundException(`Товар #${id} не найден`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager) => {
      // Валидация цены
      const price = parseFloat(dto.price);
      if (isNaN(price) || price <= 0) {
        throw new BadRequestException('Некорректная цена');
      }

      // Производитель
      let manufacturer = await manager.findOne(Manufacturer, {
        where: { name: dto.manufacturer }
      });
      if (!manufacturer) {
        manufacturer = manager.create(Manufacturer, {
          name: dto.manufacturer,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан',
        });
        await manager.save(manufacturer);
      }

      // Товар
      const product = manager.create(Product, {
        name: dto.name,
        count: dto.count,
        group: dto.group,
        number: dto.number,
        price: price,
        manufacturer,
      });
      await manager.save(product);

      // Прайс-лист
      const priceList = manager.create(PriceList, {
        price: price,
        productName: dto.name,
        group: dto.group,
        product,
        manufacturer,
      });
      await manager.save(priceList);

      return product;
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager) => {
      const product = await this.findOne(id);

      // Производитель
      if (dto.manufacturer && dto.manufacturer !== product.manufacturer.name) {
        let manufacturer = await manager.findOne(Manufacturer, {
          where: { name: dto.manufacturer }
        });
        if (!manufacturer) {
          manufacturer = manager.create(Manufacturer, {
            name: dto.manufacturer,
            address: 'Не указан',
            phone: 'Не указан',
            directorName: 'Не указан',
          });
          await manager.save(manufacturer);
        }
        product.manufacturer = manufacturer;
      }

      // Основные поля
      if (dto.name) product.name = dto.name;
      if (dto.count) product.count = dto.count;
      if (dto.group) product.group = dto.group;
      if (dto.number) product.number = dto.number;
      if (dto.price) {
        const price = parseFloat(dto.price);
        if (isNaN(price)) throw new BadRequestException('Некорректная цена');
        product.price = price;
      }

      await manager.save(product);
      return product;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Товар #${id} не найден`);
    }
  }
}
