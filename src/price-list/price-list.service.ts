import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceList } from '../entities/price-list.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { Product } from '../entities/product.entity';
import { CreatePriceListDto } from "./dto/create-price-list.dto";
import { UpdatePriceListDto } from "./dto/update-price-list.dto";


@Injectable()
export class PriceListService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepo: Repository<PriceList>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepo: Repository<Manufacturer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreatePriceListDto): Promise<PriceList> {
    // 1. Обрабатываем производителя
    let manufacturer = await this.manufacturerRepo.findOne({
      where: { name: dto.manufacturer }
    });
    if (!manufacturer) {
      manufacturer = this.manufacturerRepo.create({
        name: dto.manufacturer,
        address: 'Не указан',
        phone: 'Не указан',
        directorName: 'Не указан'
      });
      manufacturer = await this.manufacturerRepo.save(manufacturer);
    }

    // 2. Обрабатываем товар
    let product = await this.productRepo.findOne({
      where: { name: dto.productName }
    });
    if (!product) {
      product = this.productRepo.create({
        name: dto.productName,
        count: 0,
        group: dto.group,
        number: `AUTO-${Date.now()}`,
        price: parseFloat(dto.price),
        manufacturer
      });
      product = await this.productRepo.save(product);
    }

    // 3. Создаем прайс-лист
    const priceList = this.priceListRepo.create({
      manufacturer,
      product,
      productName: dto.productName,
      group: dto.group,
      price: parseFloat(dto.price)
    });

    return this.priceListRepo.save(priceList);
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
    if (!priceList) {
      throw new NotFoundException(`Price list #${id} not found`);
    }
    return priceList;
  }

  async update(id: number, dto: UpdatePriceListDto): Promise<PriceList> {
    const priceList = await this.priceListRepo.findOne({
      where: { id },
      relations: ['manufacturer', 'product']
    });
    if (!priceList) throw new NotFoundException(`Price list #${id} not found`);

    // Обновление производителя
    if (dto.manufacturer && dto.manufacturer !== priceList.manufacturer.name) {
      let manufacturer = await this.manufacturerRepo.findOne({
        where: { name: dto.manufacturer }
      });
      if (!manufacturer) {
        manufacturer = this.manufacturerRepo.create({
          name: dto.manufacturer,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан'
        });
        manufacturer = await this.manufacturerRepo.save(manufacturer);
      }
      priceList.manufacturer = manufacturer;
    }

    // Обновление товара
    if (dto.productName && dto.productName !== priceList.productName) {
      let product = await this.productRepo.findOne({
        where: { name: dto.productName }
      });
      if (!product) {
        product = this.productRepo.create({
          name: dto.productName,
          count: 0,
          group: dto.group || priceList.group,
          number: `AUTO-${Date.now()}`,
          price: dto.price ? parseFloat(dto.price) : priceList.price,
          manufacturer: priceList.manufacturer
        });
        product = await this.productRepo.save(product);
      }
      priceList.product = product;
      priceList.productName = dto.productName;
    }

    if (dto.group) priceList.group = dto.group;
    if (dto.price) priceList.price = parseFloat(dto.price);

    return this.priceListRepo.save(priceList);
  }

  async remove(id: number): Promise<void> {
    const result = await this.priceListRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Price list #${id} not found`);
    }
  }
}
