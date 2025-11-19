import { IsInt, IsOptional, Min, Max, IsNumber, IsEnum, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoDto } from './create-pago.dto';
import { Type, Transform } from 'class-transformer';

export class UpdatePagoDto extends PartialType(CreatePagoDto) {
    @IsInt({ message: 'El estado debe ser un número entero' })
    @Min(0, { message: 'El estado debe ser al menos 0' })
    @Max(1, { message: 'El estado debe ser como máximo 1' })
    @IsOptional()
    estado?: number;

    @IsNumber({}, { message: 'El monto debe ser un número' })
    @IsOptional()
    monto?: number;

    @IsDate({ message: 'La fecha de pago debe ser una fecha válida' })
    @Type(() => Date)
    @Transform(({ value }) => value ? new Date(value) : value)
    @IsOptional()
    fechaPago?: Date;
}

