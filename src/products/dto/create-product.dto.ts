import { IsString, IsInt, IsPositive, Length, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Galaxy S23', description: 'Product name' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 50, description: 'Product count' })
  @IsInt()
  @IsPositive()
  count: number;

  @ApiProperty({ example: 'Smartphones', description: 'Product group' })
  @IsString()
  @Length(1, 50)
  group: string;

  @ApiProperty({ example: 'GS23-001', description: 'Product number' })
  @IsString()
  @Length(1, 50)
  number: string;

  @ApiProperty({ example: 'Samsung', description: 'Manufacturer name' })
  @IsString()
  @Length(1, 100)
  manufacturer: string;

  @ApiProperty({ example: '799.99', description: 'Product price' })
  @IsNumberString()
  @Length(1, 20)
  price: string;
}
