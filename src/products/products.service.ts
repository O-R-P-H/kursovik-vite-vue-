import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepo: Repository<Manufacturer>,
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

    return this.productRepo.find({ where, relations: ['manufacturer'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['manufacturer'],
    });
    if (!product) throw new NotFoundException(`Товар #${id} не найден`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // Валидация цены
    const price = parseFloat(dto.price);
    if (isNaN(price) || price <= 0) {
      throw new BadRequestException('Некорректная цена');
    }

    // Поиск или создание производителя
    let manufacturer = await this.manufacturerRepo.findOne({
      where: { name: dto.manufacturer }
    });
    if (!manufacturer) {
      manufacturer = this.manufacturerRepo.create({
        name: dto.manufacturer,
        address: 'Не указан',
        phone: 'Не указан',
        directorName: 'Не указан',
      });
      manufacturer = await this.manufacturerRepo.save(manufacturer);
    }

    // Создание товара
    const product = this.productRepo.create({
      ...dto,
      price: price,
      manufacturer,
    });

    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Обновление производителя
    if (dto.manufacturer && dto.manufacturer !== product.manufacturer.name) {
      let manufacturer = await this.manufacturerRepo.findOne({
        where: { name: dto.manufacturer }
      });
      if (!manufacturer) {
        manufacturer = this.manufacturerRepo.create({
          name: dto.manufacturer,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан',
        });
        manufacturer = await this.manufacturerRepo.save(manufacturer);
      }
      product.manufacturer = manufacturer;
    }

    // Обновление остальных полей
    if (dto.name) product.name = dto.name;
    if (dto.count) product.count = dto.count;
    if (dto.group) product.group = dto.group;
    if (dto.number) product.number = dto.number;
    if (dto.price) {
      const price = parseFloat(dto.price);
      if (isNaN(price)) throw new BadRequestException('Некорректная цена');
      product.price = price;
    }

    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Товар #${id} не найден`);
    }
  }
}
