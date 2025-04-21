import { IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePriceListDto {
  @ApiProperty({ example: 'Samsung', description: 'Manufacturer name' })
  @IsString()
  manufacturer: string;

  @ApiProperty({ example: 'Galaxy S23', description: 'Product name' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 'Smartphones', description: 'Product group' })
  @IsString()
  group: string;

  @ApiProperty({ example: '999.99', description: 'Product price' })
  @IsNumberString()
  price: string;
}
