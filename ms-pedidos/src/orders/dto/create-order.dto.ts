import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsPositive,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do produto não pode estar vazio' })
  productId: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do produto não pode estar vazio' })
  productName: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade mínima é 1' })
  quantity: number;

  @IsNumber({}, { message: 'O preço unitário deve ser um número' })
  @IsPositive({ message: 'O preço unitário deve ser positivo' })
  unitPrice: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  customerID: number;

  @IsString()
  @IsNotEmpty({ message: 'O endereço de entrega é obrigatório' })
  deliveryAddress: string;

  @IsArray({ message: 'Os itens devem ser um array' })
  @ArrayMinSize(1, { message: 'O pedido deve ter pelo menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}