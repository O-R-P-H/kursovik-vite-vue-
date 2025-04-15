import { IsString, IsInt, IsPositive, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Смартфон X5', description: 'Название товара' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 10, description: 'Количество на складе' })
  @IsInt()
  @IsPositive()
  count: number;

  @ApiProperty({ example: 'Электроника', description: 'Группа товара' })
  @IsString()
  @Length(1, 50)
  group: string;

  @ApiProperty({ example: 'X5-2023', description: 'Уникальный номер' })
  @IsString()
  @Length(1, 50)
  number: string;

  @ApiProperty({ example: 'Xiaomi', description: 'Производитель' })
  @IsString()
  @Length(1, 100)
  manufacturer: string;

  @ApiProperty({ example: '299.99', description: 'Цена' })
  @IsString()
  price: string;
}
