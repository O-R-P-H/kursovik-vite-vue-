import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Manufacturer } from './manufacturer.entity';
import { Product } from './product.entity';

@Entity()
export class PriceList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.priceLists, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @ManyToOne(() => Product, (product) => product.priceLists, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

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

  @Column({ length: 100 })
  productName: string;

  @Column({ length: 50 })
  group: string;
}
