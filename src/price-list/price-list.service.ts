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
    private priceListRepo: Repository<PriceList>
  ) {} // Удалены неиспользуемые manufacturerRepo и productRepo

  async create(dto: CreatePriceListDto): Promise<PriceList> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const price = this.parsePrice(dto.price);

      const manufacturer = await manager.findOne(Manufacturer, {
        where: { name: dto.manufacturer }
      }) || await this.createManufacturer(manager, dto.manufacturer);

      const product = await manager.findOne(Product, {
        where: {
          name: dto.productName,
          manufacturer: { id: manufacturer.id }
        }
      }) || await this.createProduct(
        manager,
        dto.productName,
        dto.group,
        price,
        manufacturer
      );

      const priceList = manager.create(PriceList, {
        price,
        productName: dto.productName,
        group: dto.group,
        product,
        manufacturer
      });

      return manager.save(priceList);
    });
  }

  async findAll(): Promise<PriceList[]> {
    return this.priceListRepo.find({
      relations: ['manufacturer', 'product'],
      order: { id: 'ASC' }
    });
  }

  async findOne(id: number): Promise<PriceList> {
    const priceList = await this.priceListRepo.findOne({
      where: { id },
      relations: ['manufacturer', 'product']
    });
    if (!priceList) throw new NotFoundException(`Прайс-лист #${id} не найден`);
    return priceList;
  }

  async update(id: number, dto: UpdatePriceListDto): Promise<PriceList> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const priceList = await this.findOne(id);
      let shouldUpdate = false;

      if (dto.manufacturer && dto.manufacturer !== priceList.manufacturer.name) {
        priceList.manufacturer = await manager.findOne(Manufacturer, {
          where: { name: dto.manufacturer }
        }) || await this.createManufacturer(manager, dto.manufacturer);
        shouldUpdate = true;
      }

      if (dto.productName && dto.productName !== priceList.productName) {
        const price = dto.price ? this.parsePrice(dto.price) : priceList.price;
        priceList.product = await manager.findOne(Product, {
          where: {
            name: dto.productName,
            manufacturer: { id: priceList.manufacturer.id }
          }
        }) || await this.createProduct(
          manager,
          dto.productName,
          dto.group || priceList.group,
          price,
          priceList.manufacturer
        );
        priceList.productName = dto.productName;
        shouldUpdate = true;
      }

      if (dto.group && dto.group !== priceList.group) {
        priceList.group = dto.group;
        shouldUpdate = true;
      }

      if (dto.price) {
        priceList.price = this.parsePrice(dto.price);
        shouldUpdate = true;
      }

      return shouldUpdate ? manager.save(priceList) : priceList;
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.priceListRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Прайс-лист #${id} не найден`);
    }
  }

  private async createManufacturer(
    manager: EntityManager,
    name: string
  ): Promise<Manufacturer> {
    const manufacturer = manager.create(Manufacturer, {
      name,
      address: 'Не указан',
      phone: 'Не указан',
      directorName: 'Не указан'
    });
    return manager.save(manufacturer);
  }

  private async createProduct(
    manager: EntityManager,
    name: string,
    group: string,
    price: number,
    manufacturer: Manufacturer
  ): Promise<Product> {
    const product = manager.create(Product, {
      name,
      price,
      group,
      number: 'не указан',
      count: 0,
      manufacturer
    });
    return manager.save(product);
  }

  private parsePrice(price: string): number {
    const value = parseFloat(price);
    if (isNaN(value) || value < 0) {
      throw new BadRequestException('Некорректное значение цены');
    }
    return parseFloat(value.toFixed(2));
  }
}
