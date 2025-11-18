import { Type } from 'class-transformer';
import { IsDateString, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTarifarioDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  tipo_habitacion_id: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  costo_base: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  utilidad: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  estado: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  precio_venta?: number;
}
