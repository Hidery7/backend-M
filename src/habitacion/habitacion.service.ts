import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoHabitacion, Habitacion } from './entities/habitacion.entity';
import { Repository } from 'typeorm';
import { TipoHabitacionService } from 'src/tipo_habitacion/tipo_habitacion.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { Reserva } from 'src/reserva/entities/reserva.entity';

@Injectable()
export class HabitacionService {

    constructor(
        @InjectRepository(Habitacion)
        private readonly habitacionRepository: Repository<Habitacion>,
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        private readonly tipoHabitacionService: TipoHabitacionService,
    ) { }

    async create(createHabitacionDto: CreateHabitacionDto): Promise<Habitacion> {
        await this.tipoHabitacionService.findOne(createHabitacionDto.tipoHabitacionId);

        const existeNumero = await this.habitacionRepository.findOne({
            where: { numero: createHabitacionDto.numero }
        });

        if (existeNumero) {
            throw new BadRequestException(`Ya existe una habitación con el número ${createHabitacionDto.numero}`);
        }

        const habitacion = this.habitacionRepository.create(createHabitacionDto);
        return await this.habitacionRepository.save(habitacion);
    }

    async findAll(): Promise<any[]> {
        const habitaciones = await this.habitacionRepository.find({
            relations: ['tipoHabitacion'],
            order: { piso: 'ASC', numero: 'ASC' }
        });

        return await this.obtenerHabitacionesConEstados(habitaciones);
    }

    async findOne(id: number): Promise<any> {
        const habitacion = await this.habitacionRepository.findOne({
            where: { idHabitacion: id },
            relations: ['tipoHabitacion']
        });

        if (!habitacion) {
            throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
        }

        const [habitacionConEstado] = await this.obtenerHabitacionesConEstados([habitacion]);
        return habitacionConEstado;
    }

    async findByTipo(tipoHabitacionId: number): Promise<any[]> {
        const habitaciones = await this.habitacionRepository.find({
            where: { tipoHabitacionId },
            relations: ['tipoHabitacion'],
            order: { piso: 'ASC', numero: 'ASC' }
        });

        return await this.obtenerHabitacionesConEstados(habitaciones);
    }

    async findDisponibles(): Promise<any[]> {
        const habitaciones = await this.habitacionRepository.find({
            where: {
                estadoActividad: 1
            },
            relations: ['tipoHabitacion'],
            order: { piso: 'ASC', numero: 'ASC' }
        });

        const habitacionesConEstados = await this.obtenerHabitacionesConEstados(habitaciones);
        return habitacionesConEstados.filter(h => h.estado === EstadoHabitacion.DISPONIBLE);
    }

    async update(id: number, updateHabitacionDto: UpdateHabitacionDto): Promise<any> {
        const habitacion = await this.habitacionRepository.findOne({
            where: { idHabitacion: id }
        });

        if (!habitacion) {
            throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
        }

        if (updateHabitacionDto.tipoHabitacionId) {
            await this.tipoHabitacionService.findOne(updateHabitacionDto.tipoHabitacionId);
        }

        if (updateHabitacionDto.numero && updateHabitacionDto.numero !== habitacion.numero) {
            const existeNumero = await this.habitacionRepository.findOne({
                where: { numero: updateHabitacionDto.numero }
            });

            if (existeNumero) {
                throw new BadRequestException(`Ya existe una habitación con el número ${updateHabitacionDto.numero}`);
            }
        }

        this.habitacionRepository.merge(habitacion, updateHabitacionDto);
        const habitacionActualizada = await this.habitacionRepository.save(habitacion);

        return await this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const habitacion = await this.habitacionRepository.findOne({
            where: { idHabitacion: id }
        });

        if (!habitacion) {
            throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
        }

        await this.habitacionRepository.remove(habitacion);
    }

    private async calcularEstadoHabitacion(idHabitacion: number): Promise<EstadoHabitacion> {
        const fechaActual = new Date();

        // Buscar reservas activas para esta habitación
        const reservasActivas = await this.reservaRepository.find({
            where: {
                idHabitacion,
                estado: 1
            },
            order: { fechaEntrada: 'ASC' }
        });

        if (reservasActivas.length === 0) {
            return EstadoHabitacion.DISPONIBLE;
        }

        // Verificar si hay una reserva ocupando la habitación actualmente
        for (const reserva of reservasActivas) {
            const fechaEntrada = new Date(reserva.fechaEntrada);
            const fechaSalida = new Date(reserva.fechaSalida);

            // ✅ CORREGIDO: Comparación más precisa incluyendo el día actual
            if (fechaActual >= fechaEntrada && fechaActual < fechaSalida) {
                return EstadoHabitacion.OCUPADA;
            }

            // ✅ RESERVADO: hay una reserva futura
            if (fechaActual < fechaEntrada) {
                return EstadoHabitacion.RESERVADO;
            }
        }

        return EstadoHabitacion.DISPONIBLE;
    }

    private async obtenerReservaActiva(idHabitacion: number): Promise<number | null> {
        const fechaActual = new Date();

        const reserva = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.idHabitacion = :idHabitacion', { idHabitacion })
            .andWhere('reserva.estado = :estado', { estado: 1 })
            .andWhere('reserva.fechaEntrada <= :fechaActual', { fechaActual })
            .andWhere('reserva.fechaSalida > :fechaActual', { fechaActual })
            .orderBy('reserva.fechaEntrada', 'ASC')
            .getOne();

        return reserva?.idReserva || null;
    }

    private async obtenerProximaReserva(idHabitacion: number): Promise<number | null> {
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        const reserva = await this.reservaRepository
            .createQueryBuilder('reserva')
            .where('reserva.idHabitacion = :idHabitacion', { idHabitacion })
            .andWhere('reserva.estado = :estado', { estado: 1 })
            .andWhere('reserva.fechaEntrada > :fechaActual', { fechaActual })
            .orderBy('reserva.fechaEntrada', 'ASC')
            .getOne();

        return reserva?.idReserva || null;
    }

    /**
     * ✅ CORREGIDO: Obtiene habitaciones con sus estados actualizados e ID de reserva
     * Eliminada toda referencia a MANTENIMIENTO
     */
    private async obtenerHabitacionesConEstados(habitaciones: Habitacion[]): Promise<any[]> {
        const resultado: any[] = [];

        for (const habitacion of habitaciones) {
            // ✅ SIEMPRE calcular estado automático - eliminado el chequeo de mantenimiento
            const estadoActual = await this.calcularEstadoHabitacion(habitacion.idHabitacion);
            let idReserva: number | null = null;

            // Obtener ID de reserva según el estado
            if (estadoActual === EstadoHabitacion.OCUPADA) {
                idReserva = await this.obtenerReservaActiva(habitacion.idHabitacion);
            } else if (estadoActual === EstadoHabitacion.RESERVADO) {
                idReserva = await this.obtenerProximaReserva(habitacion.idHabitacion);
            }

            resultado.push({
                ...habitacion,
                estado: estadoActual,
                numeroInput: idReserva ? idReserva.toString() : ''
            });
        }

        return resultado;
    }

    /**
     * ✅ NUEVO: Método para forzar la actualización de estados (para testing)
     */
    async forzarActualizacionEstados(): Promise<void> {
        const habitaciones = await this.habitacionRepository.find({
            where: { estadoActividad: 1 }
        });

        for (const habitacion of habitaciones) {
            const nuevoEstado = await this.calcularEstadoHabitacion(habitacion.idHabitacion);
            if (habitacion.estado !== nuevoEstado) {
                habitacion.estado = nuevoEstado;
                await this.habitacionRepository.save(habitacion);
            }
        }
    }
}
