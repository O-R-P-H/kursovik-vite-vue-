import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';
import { Product } from './product.entity';

@Entity()
export class PriceList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Manufacturer, { eager: true })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
      to: (value: string) => value, // сохраняем как string
      from: (value: string) => value // получаем как string
    }})
  price: string;

  @Column({ length: 100 })
  productName: string;

  @Column({ length: 50 })
  group: string;
}
