import { IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePriceListDto {
  @ApiProperty({ example: 'Samsung', description: 'Производитель' })
  @IsString()
  manufacturer: string;

  @ApiProperty({ example: 'Galaxy S23', description: 'Название товара' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 'Смартфоны', description: 'Группа товаров' })
  @IsString()
  group: string;

  @ApiProperty({ example: '999.99', description: 'Цена' })
  @IsNumberString()
  price: string;
}
