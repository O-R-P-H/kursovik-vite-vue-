import { IsString, IsInt, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsInt()
  @IsPositive()
  count: number;

  @IsString()
  @Length(1, 50)
  group: string;

  @IsString()
  @Length(1, 50)
  number: string;

  @IsString()
  @Length(1, 100)
  manufacturer: string;

  @IsString()
  @Length(1, 100)
  price: string;
}
