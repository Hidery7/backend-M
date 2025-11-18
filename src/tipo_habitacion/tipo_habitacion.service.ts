import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHabitacion } from './entities/tipo_habitacion.entity';

@Injectable()
export class TipoHabitacionService {

    constructor(
        @InjectRepository(TipoHabitacion)
        private readonly tipoHabitacionRepository: Repository<TipoHabitacion>,
    ) { }

    /**
     * Obtiene todos los tipos de habitación
     */
    async findAll(): Promise<TipoHabitacion[]> {
        return await this.tipoHabitacionRepository.find({
            order: { nombre: 'ASC' },
        });
    }

    /**
     * Busca un tipo de habitación por ID
     */
    async findOne(id: number): Promise<TipoHabitacion> {
        const tipo = await this.tipoHabitacionRepository.findOne({
            where: { tipoHabitacionId: id }
        });

        if (!tipo) {
            throw new NotFoundException(`Tipo de habitación con ID ${id} no encontrado`);
        }

        return tipo;
    }

    /**
     * Busca un tipo de habitación por nombre
     */
    async findByNombre(nombre: string): Promise<TipoHabitacion | null> {
        return await this.tipoHabitacionRepository.findOne({
            where: { nombre }
        });
    }

    /**
     * Verifica si existe un tipo de habitación
     */
    async exists(id: number): Promise<boolean> {
        const count = await this.tipoHabitacionRepository.count({
            where: { tipoHabitacionId: id }
        });
        return count > 0;
    }
}
