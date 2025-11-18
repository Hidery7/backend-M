import { IsString, IsNotEmpty, IsOptional, IsIn, IsDateString, IsInt, Min, Max, IsEmail, IsNumber } from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsNumber()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsIn(['DNI', 'PASAPORTE', 'CE'], { message: 'El tipo de documento debe ser DNI, PASAPORTE o CE' })
  @IsNotEmpty()
  tipoDocumento: string;

  @IsNumber()
  @IsNotEmpty()
  numeroDocumento: string;

  @IsString()
  @IsOptional()
  nacionalidad?: string;

  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  estado?: number = 1;

  @IsDateString()
  @IsOptional()
  fechaRegistro?: Date;

  @IsString()
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsNotEmpty()
  correoElectronico: string;
}
