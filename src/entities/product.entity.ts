import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('int')
  count: number;

  @Column({ length: 50 })
  group: string;

  @Column({ length: 50, unique: true })
  number: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Manufacturer, { eager: true })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;
}
