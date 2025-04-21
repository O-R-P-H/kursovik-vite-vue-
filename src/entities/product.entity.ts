import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Manufacturer } from './manufacturer.entity';
import { PriceList } from './price-list.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('int')
  count: number;

  @Column({ length: 50 })
  group: string;

  @Column({ length: 50 })
  number: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: string) => value,
      from: (value: string) => value
    }
  })
  price: string;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @OneToMany(() => PriceList, (priceList) => priceList.product, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  priceLists: PriceList[];
}
