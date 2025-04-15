import { IsString, IsInt, IsPositive, Length, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Смартфон Galaxy S23', description: 'Название товара' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 50, description: 'Количество на складе' })
  @IsInt()
  @IsPositive()
  count: number;

  @ApiProperty({ example: 'Электроника', description: 'Категория товара' })
  @IsString()
  @Length(1, 50)
  group: string;

  @ApiProperty({ example: 'GS23-001', description: 'Уникальный артикул' })
  @IsString()
  @Length(1, 50)
  number: string;

  @ApiProperty({ example: 'Samsung', description: 'Производитель (строка)' })
  @IsString()
  @Length(1, 100)
  manufacturer: string;

  @ApiProperty({ example: '799.99', description: 'Цена (строка с числом)' })
  @IsNumberString()
  @Length(1, 20)
  price: string;
}
