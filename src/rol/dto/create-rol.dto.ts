import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  nombre: string;

  @IsNumber()
  @IsOptional()
  estado?: number = 1; // Valor por defecto: 1 (activo)
}
