import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional } from 'class-validator';
import { CreateTarifarioDto } from './create-tarifario.dto';
import { Type } from 'class-transformer';

export class UpdateTarifarioDto extends PartialType(CreateTarifarioDto) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tipo_habitacion_id?: number;
}

// Notas:
// 1. Usamos tipoHabitacionId para mantener consistencia con TypeScript
// 2. El decorador @IsOptional() hace que el campo sea opcional
// 3. El tipo de relación se maneja a través del servicio
