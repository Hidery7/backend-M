import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pagos.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
    constructor(
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
    ) {}

    async create(createPagoDto: CreatePagoDto): Promise<Pago> {
        // Validar que el monto sea positivo
        if (createPagoDto.monto <= 0) {
            throw new BadRequestException('El monto debe ser mayor a 0');
        }

        // Validar que la fecha de pago no sea futura
        const fechaPago = new Date(createPagoDto.fechaPago);
        const hoy = new Date();
        hoy.setHours(23, 59, 59, 999);
        
        if (fechaPago > hoy) {
            throw new BadRequestException('La fecha de pago no puede ser futura');
        }

        const pago = this.pagoRepository.create(createPagoDto);
        return await this.pagoRepository.save(pago);
    }

    async findAll(): Promise<Pago[]> {
        return await this.pagoRepository.find({
            relations: ['reserva', 'reserva.persona', 'usuario'],
            order: { fechaPago: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Pago> {
        const pago = await this.pagoRepository.findOne({
            where: { idPago: id },
            relations: ['reserva', 'reserva.persona', 'reserva.habitacion', 'usuario'],
        });

        if (!pago) {
            throw new NotFoundException(`Pago con ID ${id} no encontrado`);
        }

        return pago;
    }

    async findByReserva(idReserva: number): Promise<Pago[]> {
        return await this.pagoRepository.find({
            where: { idReserva },
            relations: ['reserva', 'reserva.persona', 'usuario'],
            order: { fechaPago: 'DESC' }
        });
    }

    async findByUsuario(idUsuario: number): Promise<Pago[]> {
        return await this.pagoRepository.find({
            where: { idUsuario },
            relations: ['reserva', 'reserva.persona', 'usuario'],
            order: { fechaPago: 'DESC' }
        });
    }

    async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
        const pago = await this.findOne(id);

        // Validar monto si se actualiza
        if (updatePagoDto.monto !== undefined && updatePagoDto.monto <= 0) {
            throw new BadRequestException('El monto debe ser mayor a 0');
        }

        // Validar fecha si se actualiza
        if (updatePagoDto.fechaPago) {
            const fechaPago = new Date(updatePagoDto.fechaPago);
            const hoy = new Date();
            hoy.setHours(23, 59, 59, 999);
            
            if (fechaPago > hoy) {
                throw new BadRequestException('La fecha de pago no puede ser futura');
            }
        }

        Object.assign(pago, updatePagoDto);
        return await this.pagoRepository.save(pago);
    }

    async remove(id: number): Promise<void> {
        const pago = await this.findOne(id);
        await this.pagoRepository.remove(pago);
    }

    async cambiarEstado(id: number, estado: number): Promise<Pago> {
        const pago = await this.findOne(id);
        pago.estado = estado;
        return await this.pagoRepository.save(pago);
    }
}
