import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Manufacturer } from './manufacturer.entity';
import { PriceList } from "./price-list.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn() // Автоинкрементный ID (1, 2, 3...)
  id: number;

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

  @ManyToOne(() => Manufacturer, { eager: true }) // Автоподгрузка производителя
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @OneToMany(() => PriceList, (priceList) => priceList.product)
  priceLists: PriceList[];
}
