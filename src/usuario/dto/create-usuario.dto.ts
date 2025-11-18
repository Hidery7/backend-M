import { IsString, IsNotEmpty, IsNumber } from 'class-validator'; //trnsferir datos de una app cliente - servidor 

export class CreateUsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  idRol: number;

  @IsNumber()
  @IsNotEmpty()
  idPersona: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  estado: number;
}
