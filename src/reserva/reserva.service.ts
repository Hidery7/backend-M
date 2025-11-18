import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { HabitacionService } from 'src/habitacion/habitacion.service';

@Injectable()
export class ReservaService {

    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        // ✅ ELIMINAR HabitacionService para romper dependencia circular
    ) { }

    async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
        const entrada = new Date(createReservaDto.fechaEntrada);
        const salida = new Date(createReservaDto.fechaSalida);

        // Validar fechas
        if (salida <= entrada) {
            throw new BadRequestException('La fecha de salida debe ser posterior a la fecha de entrada');
        }

        // Normalizar fechas a UTC (solo año, mes, día)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        entrada.setHours(0, 0, 0, 0);

        // Permitir reservas desde hoy en adelante (>=)
        if (entrada < hoy) {
            throw new BadRequestException('La fecha de entrada no puede ser anterior a hoy');
        }

        // ✅ CORREGIR: Verificar disponibilidad de habitación
        const conflicto = await this.verificarDisponibilidad(
            createReservaDto.idHabitacion,
            entrada,
            salida
        );

        if (conflicto) {
            throw new ConflictException('La habitación no está disponible en las fechas seleccionadas');
        }

        const reserva = this.reservaRepository.create(createReservaDto);
        return await this.reservaRepository.save(reserva);

        // ✅ ELIMINAR llamada a actualizarEstadoHabitacion (causaba dependencia circular)
    }

    async findAll(): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            relations: ['persona', 'habitacion', 'habitacion.tipoHabitacion', 'usuario', 'pagos'],
            order: { fechaEntrada: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Reserva> {
        const reserva = await this.reservaRepository.findOne({
            where: { idReserva: id },
            relations: ['persona', 'habitacion', 'habitacion.tipoHabitacion', 'usuario', 'pagos'],
        });

        if (!reserva) {
            throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
        }

        return reserva;
    }

    async findByPersona(idPersona: number): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            where: { idPersona },
            relations: ['habitacion', 'habitacion.tipoHabitacion', 'usuario', 'pagos'],
            order: { fechaEntrada: 'DESC' }
        });
    }

    async findByHabitacion(idHabitacion: number): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            where: { idHabitacion },
            relations: ['persona', 'usuario', 'pagos'],
            order: { fechaEntrada: 'DESC' }
        });
    }

    async findActivas(): Promise<Reserva[]> {
        return await this.reservaRepository.find({
            where: { estado: 1 },
            relations: ['persona', 'habitacion', 'habitacion.tipoHabitacion', 'usuario'],
            order: { fechaEntrada: 'DESC' }
        });
    }

    async update(id: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
        const reserva = await this.findOne(id);

        // Validar fechas si se actualizan
        if (updateReservaDto.fechaEntrada || updateReservaDto.fechaSalida) {
            const entrada = new Date(updateReservaDto.fechaEntrada || reserva.fechaEntrada);
            const salida = new Date(updateReservaDto.fechaSalida || reserva.fechaSalida);

            if (salida <= entrada) {
                throw new BadRequestException('La fecha de salida debe ser posterior a la fecha de entrada');
            }

            // Verificar disponibilidad excluyendo la reserva actual
            if (updateReservaDto.idHabitacion || updateReservaDto.fechaEntrada || updateReservaDto.fechaSalida) {
                const idHabitacion = updateReservaDto.idHabitacion || reserva.idHabitacion;
                const conflicto = await this.verificarDisponibilidad(
                    idHabitacion,
                    entrada,
                    salida,
                    id
                );

                if (conflicto) {
                    throw new ConflictException('La habitación no está disponible en las fechas seleccionadas');
                }
            }
        }

        Object.assign(reserva, updateReservaDto);
        return await this.reservaRepository.save(reserva);
    }

    async remove(id: number): Promise<void> {
        const reserva = await this.findOne(id);
        await this.reservaRepository.remove(reserva);
    }

    async cambiarEstado(id: number, estado: number): Promise<Reserva> {
        const reserva = await this.findOne(id);
        reserva.estado = estado;
        return await this.reservaRepository.save(reserva);
    }

    // ✅ CORREGIDO: Lógica de verificación de disponibilidad
    private async verificarDisponibilidad(
        idHabitacion: number,
        fechaEntrada: Date,
        fechaSalida: Date,
        excluirReservaId?: number
    ): Promise<boolean> {
        const query = this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.idHabitacion = :idHabitacion', { idHabitacion })
            .andWhere('reserva.estado = :estado', { estado: 1 })
            .andWhere(
                // ✅ CORREGIDO: Parámetros en el orden correcto
                '(reserva.fechaEntrada < :fechaSalida AND reserva.fechaSalida > :fechaEntrada)',
                { fechaEntrada, fechaSalida }
            );

        if (excluirReservaId) {
            query.andWhere('reserva.idReserva != :excluirReservaId', { excluirReservaId });
        }

        const conflictos = await query.getCount();
        return conflictos > 0;
    }
}
