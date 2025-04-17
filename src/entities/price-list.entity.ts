import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';
import { Product } from './product.entity';

@Entity()
export class PriceList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.priceLists, { eager: true })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @ManyToOne(() => Product, (product) => product.priceLists, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 100 })
  productName: string;

  @Column({ length: 50 })
  group: string;
}
