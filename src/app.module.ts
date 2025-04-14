import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsModule } from './products/products.module';
import { Manufacturer } from "./entities/manufacturer.entity";
import { ManufacturersModule } from "./manufacturers/manufacturers.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '94.241.169.123',
      port: 5432,
      username: 'postgres', // замени на свои
      password: 'A7A5,t4R34', // замени на свои
      database: 'productcompany',    // замени на свои
      entities: [Product,Manufacturer],
      synchronize: true, // только для разработки!
    }),
    ProductsModule,
    ManufacturersModule
  ],
})
export class AppModule {}
