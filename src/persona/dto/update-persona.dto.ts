import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaDto } from './create-persona.dto';
import { IsString, IsOptional, IsIn, IsInt, Min, Max, IsEmail, IsNumber } from 'class-validator';

export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsNumber()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsIn(['DNI', 'PASAPORTE', 'CE'], { message: 'El tipo de documento debe ser DNI, PASAPORTE o CE' })
  @IsOptional()
  tipoDocumento?: string;

  @IsNumber()
  @IsOptional()
  numeroDocumento?: string;

  @IsString()
  @IsOptional()
  nacionalidad?: string;

  @IsString()
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsOptional()
  correoElectronico?: string;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  estado?: number;
}
