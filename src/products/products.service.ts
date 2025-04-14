import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Manufacturer } from '../entities/manufacturer.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async findAll(query?: {
    name?: string;
    group?: string;
    manufacturerName?: string;
  }): Promise<Product[]> {
    const where = {};
    if (query?.name) where['name'] = Like(`%${query.name}%`);
    if (query?.group) where['group'] = query.group;
    if (query?.manufacturerName) {
      where['manufacturer'] = { name: Like(`%${query.manufacturerName}%`) };
    }

    return this.productsRepository.find({
      where,
      relations: ['manufacturer']
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['manufacturer']
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Ищем или создаем производителя
    let manufacturer = await this.manufacturerRepository.findOne({
      where: { name: createProductDto.manufacturerName }
    });

    if (!manufacturer) {
      manufacturer = this.manufacturerRepository.create({
        name: createProductDto.manufacturerName,
        address: 'Не указан', // Можно сделать обязательным в DTO
        phone: 'Не указан',
        directorName: 'Не указан'
      });
      await this.manufacturerRepository.save(manufacturer);
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      manufacturer
    });

    return this.productsRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Обновляем производителя при необходимости
    if (updateProductDto.manufacturerName &&
      updateProductDto.manufacturerName !== product.manufacturer.name) {
      let manufacturer = await this.manufacturerRepository.findOne({
        where: { name: updateProductDto.manufacturerName }
      });

      if (!manufacturer) {
        manufacturer = this.manufacturerRepository.create({
          name: updateProductDto.manufacturerName,
          address: 'Не указан',
          phone: 'Не указан',
          directorName: 'Не указан'
        });
        await this.manufacturerRepository.save(manufacturer);
      }
      product.manufacturer = manufacturer;
    }

    // Обновляем остальные поля
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async deleteMultiple(ids: number[]): Promise<{ message: string }> {
    await this.productsRepository.delete(ids);
    return { message: `${ids.length} товаров удалено` };
  }
}
