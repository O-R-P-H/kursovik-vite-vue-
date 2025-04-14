import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

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

  @Column({ length: 100, name: 'director_name' })
  directorName: string;

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];
}
