import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturersRepository: Repository<Manufacturer>,
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
    return this.manufacturersRepository.find();
  }

  async findOne(id: number): Promise<Manufacturer> {
    return this.manufacturersRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateManufacturerDto: UpdateManufacturerDto,
  ): Promise<Manufacturer> {
    await this.manufacturersRepository.update(id, updateManufacturerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.manufacturersRepository.delete(id);
  }
}
