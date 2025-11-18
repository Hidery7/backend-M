import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { EstadoHabitacion } from '../entities/habitacion.entity';

export class CreateHabitacionDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  tipoHabitacionId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  piso: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  numero: string;

  @IsEnum(EstadoHabitacion)
  @IsOptional()
  estado?: EstadoHabitacion;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  estadoActividad?: number = 1;
}
