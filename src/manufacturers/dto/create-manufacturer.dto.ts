import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManufacturerDto {
  @ApiProperty({ example: 'Samsung', description: 'Manufacturer name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'South Korea', description: 'Manufacturer address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+123456789', description: 'Manufacturer phone' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'John Doe', description: 'Director name' })
  @IsString()
  @IsNotEmpty()
  directorName: string;
}
