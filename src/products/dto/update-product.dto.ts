import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  count?: number;

  @ApiProperty({ required: false })
  group?: string;

  @ApiProperty({ required: false })
  number?: string;

  @ApiProperty({ required: false })
  manufacturer?: string;

  @ApiProperty({ required: false })
  price?: string;
}
