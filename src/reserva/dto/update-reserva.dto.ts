import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
    @IsInt({ message: 'El estado debe ser un número entero' })
    @Min(0, { message: 'El estado debe ser al menos 0' })
    @Max(1, { message: 'El estado debe ser como máximo 1' })
    @IsOptional()
    estado?: number;
}