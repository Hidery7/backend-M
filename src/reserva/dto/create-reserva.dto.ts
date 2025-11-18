import { IsInt, IsDate, IsNotEmpty, IsPositive, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateReservaDto {
    @IsInt({ message: 'El ID de persona debe ser un número entero' })
    @IsPositive({ message: 'El ID de persona debe ser positivo' })
    @IsNotEmpty({ message: 'El ID de persona es requerido' })
    idPersona: number;

    @IsInt({ message: 'El ID de habitación debe ser un número entero' })
    @IsPositive({ message: 'El ID de habitación debe ser positivo' })
    @IsNotEmpty({ message: 'El ID de habitación es requerido' })
    idHabitacion: number;

    @IsInt({ message: 'El ID de usuario debe ser un número entero' })
    @IsPositive({ message: 'El ID de usuario debe ser positivo' })
    @IsNotEmpty({ message: 'El ID de usuario es requerido' })
    idUsuario: number;

    @IsNotEmpty({ message: 'La fecha de entrada es requerida' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha de entrada debe ser una fecha válida' })
    @Transform(({ value }) => new Date(value))
    fechaEntrada: Date;

    @IsNotEmpty({ message: 'La fecha de salida es requerida' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha de salida debe ser una fecha válida' })
    @Transform(({ value }) => new Date(value))
    fechaSalida: Date;

    @IsInt({ message: 'El estado debe ser un número entero' })
    @IsOptional()
    @Transform(({ value }) => value ?? 1)
    estado?: number = 1;
}