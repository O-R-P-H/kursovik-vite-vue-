import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';

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

  @Column({ length: 50, unique: true })
  number: string;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, {
    onDelete: 'CASCADE', // Опционально: удалять продукты при удалении производителя
    eager: true, // Автоматически подгружать производителя при запросе продукта
  })
  @JoinColumn({ name: 'manufacturer_id' }) // Указываем имя колонки в БД
  manufacturer: Manufacturer;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
