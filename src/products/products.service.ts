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
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
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

    return this.productRepository.find({
      where,
      relations: ['manufacturer'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['manufacturer'],
    });

    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // Валидация цены
    const price = parseFloat(dto.price);
    if (isNaN(price) || price <= 0) {
      throw new BadRequestException('Некорректное значение цены');
    }

    // Получаем или создаем производителя
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { name: dto.manufacturer },
    });

    const newManufacturer = manufacturer
      ? manufacturer
      : await this.manufacturerRepository.save(
        this.manufacturerRepository.create({
          name: dto.manufacturer,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан',
        }),
      );

    // Создаем продукт
    const product = this.productRepository.create({
      name: dto.name,
      count: dto.count,
      group: dto.group,
      number: dto.number,
      price: price,
      manufacturer: newManufacturer,
    });

    return this.productRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Обновление производителя при необходимости
    if (dto.manufacturer && dto.manufacturer !== product.manufacturer.name) {
      const manufacturer = await this.manufacturerRepository.findOne({
        where: { name: dto.manufacturer },
      });

      product.manufacturer = manufacturer
        ? manufacturer
        : await this.manufacturerRepository.save(
          this.manufacturerRepository.create({
            name: dto.manufacturer,
            address: 'Не указан',
            phone: 'Не указан',
            directorName: 'Не указан',
          }),
        );
    }

    // Валидация цены
    if (dto.price) {
      const price = parseFloat(dto.price);
      if (isNaN(price) || price <= 0) {
        throw new BadRequestException('Некорректное значение цены');
      }
      product.price = price;
    }

    // Обновление остальных полей
    if (dto.name) product.name = dto.name;
    if (dto.count) product.count = dto.count;
    if (dto.group) product.group = dto.group;
    if (dto.number) product.number = dto.number;

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
  }
}
