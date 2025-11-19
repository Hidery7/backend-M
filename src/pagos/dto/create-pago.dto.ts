import { IsInt, IsDate, IsNotEmpty, IsPositive, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MetodoPago } from '../entities/pagos.entity';

export class CreatePagoDto {
    @IsInt({ message: 'El ID de reserva debe ser un número entero' })
    @IsPositive({ message: 'El ID de reserva debe ser positivo' })
    @IsNotEmpty({ message: 'El ID de reserva es requerido' })
    idReserva: number;

    @IsInt({ message: 'El ID de usuario debe ser un número entero' })
    @IsPositive({ message: 'El ID de usuario debe ser positivo' })
    @IsNotEmpty({ message: 'El ID de usuario es requerido' })
    idUsuario: number;

    @IsNumber({}, { message: 'El monto debe ser un número' })
    @Min(0.01, { message: 'El monto debe ser mayor a 0' })
    @IsNotEmpty({ message: 'El monto es requerido' })
    monto: number;

    @IsNotEmpty({ message: 'La fecha de pago es requerida' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha de pago debe ser una fecha válida' })
    @Transform(({ value }) => new Date(value))
    fechaPago: Date;

    @IsEnum(MetodoPago, { message: 'El método de pago debe ser uno de los valores permitidos' })
    @IsOptional()
    metodoPago?: MetodoPago = MetodoPago.EFECTIVO;

    @IsInt({ message: 'El estado debe ser un número entero' })
    @IsOptional()
    @Transform(({ value }) => value ?? 1)
    estado?: number = 1;
}

