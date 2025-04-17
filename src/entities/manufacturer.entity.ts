import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { PriceList } from './price-list.entity';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500 })
  address: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'director_name', length: 100 })
  directorName: string;

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];

  @OneToMany(() => PriceList, (priceList) => priceList.manufacturer)
  priceLists: PriceList[];
}
