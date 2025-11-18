import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifario } from './entities/tarifario.entity';
import { CreateTarifarioDto } from './dto/create-tarifario.dto';
import { UpdateTarifarioDto } from './dto/update-tarifario.dto';
import { TipoHabitacionService } from 'src/tipo_habitacion/tipo_habitacion.service';

@Injectable()
export class TarifarioService {
  constructor(
    @InjectRepository(Tarifario)
    private readonly tarifarioRepository: Repository<Tarifario>,
    private readonly tipoHabitacionService: TipoHabitacionService,
  ) { }

  async create(createTarifarioDto: CreateTarifarioDto): Promise<Tarifario> {
    // 1. Verificar que existe el tipo de habitación
    const tipoHabitacion = await this.tipoHabitacionService.findOne(createTarifarioDto.tipo_habitacion_id);

    if (!tipoHabitacion) {
      throw new NotFoundException(`Tipo de habitación con ID ${createTarifarioDto.tipo_habitacion_id} no encontrado`);
    }

    console.log('🔍 Tipo de habitación encontrado:', {
      id: tipoHabitacion.tipoHabitacionId,
      nombre: tipoHabitacion.nombre
    });

    // 2. Calcular el precio_venta si no se proporciona
    const precioVenta = createTarifarioDto.precio_venta ||
      (createTarifarioDto.costo_base + createTarifarioDto.utilidad);

    // 3. Crear el objeto tarifario con la relación directa
    const tarifario = this.tarifarioRepository.create({
      ...createTarifarioDto,
      precio_venta: precioVenta,
      tipo_habitacion_id: tipoHabitacion.tipoHabitacionId  // Asignar directamente el ID
    });

    console.log('📝 Datos para crear tarifario:', {
      ...createTarifarioDto,
      precio_venta: precioVenta,
      tipo_habitacion_id: tipoHabitacion.tipoHabitacionId
    });

    // 4. Guardar el tarifario
    const tarifarioGuardado = await this.tarifarioRepository.save(tarifario);

    // 5. Obtener el tarifario con la relación cargada
    const tarifarioConRelacion = await this.tarifarioRepository.findOne({
      where: { idTarifario: tarifarioGuardado.idTarifario },
      relations: ['tipoHabitacion']
    });

    if (!tarifarioConRelacion) {
      throw new Error('Error al recuperar el tarifario recién creado');
    }

    console.log('✅ Tarifario creado exitosamente:', {
      id: tarifarioConRelacion.idTarifario,
      tipo_habitacion_id: tarifarioConRelacion.tipo_habitacion_id,
      tipoHabitacion: tarifarioConRelacion.tipoHabitacion?.nombre,
      precio_venta: tarifarioConRelacion.precio_venta
    });

    return tarifarioConRelacion;
  }

  async findAll(): Promise<Tarifario[]> {
    return await this.tarifarioRepository.find({
      relations: ['tipoHabitacion'],
      order: { idTarifario: 'ASC' }  // Ordenar por idTarifario de forma ascendente
    });
  }

  async findOne(id: number): Promise<Tarifario> {
    const tarifario = await this.tarifarioRepository.findOne({
      where: { idTarifario: id },
      relations: ['tipoHabitacion']
    });

    if (!tarifario) {
      throw new NotFoundException(`Tarifario con ID ${id} no encontrado`);
    }

    return tarifario;
  }

  async findByTipoHabitacion(tipoHabitacionId: number): Promise<Tarifario[]> {
    return await this.tarifarioRepository.find({
      where: {
        tipoHabitacion: { tipoHabitacionId },
        estado: 1
      },
      relations: ['tipoHabitacion'],
      order: { fecha: 'DESC' }
    });
  }

  async findActivos(): Promise<Tarifario[]> {
    return await this.tarifarioRepository.find({
      where: { estado: 1 },
      relations: ['tipoHabitacion'],
      order: { fecha: 'DESC' }
    });
  }

  async update(id: number, updateTarifarioDto: UpdateTarifarioDto): Promise<Tarifario | null> {
    const tarifario = await this.findOne(id);

    // Usar el mismo nombre de campo (snake_case)
    if (updateTarifarioDto.tipo_habitacion_id) {
      const tipoHabitacion = await this.tipoHabitacionService.findOne(updateTarifarioDto.tipo_habitacion_id);
      if (!tipoHabitacion) {
        throw new NotFoundException('Tipo de habitación no encontrado');
      }
      tarifario.tipoHabitacion = tipoHabitacion;
      delete updateTarifarioDto.tipo_habitacion_id; // Eliminar para evitar conflicto en el merge
    }

    // Actualizar los demás campos
    Object.assign(tarifario, updateTarifarioDto);

    // Guardar los cambios
    const tarifarioActualizado = await this.tarifarioRepository.save(tarifario);

    // Devolver el tarifario actualizado con sus relaciones
    return await this.tarifarioRepository.findOne({
      where: { idTarifario: tarifarioActualizado.idTarifario },
      relations: ['tipoHabitacion']
    });
  }

  async remove(id: number): Promise<void> {
    const tarifario = await this.findOne(id);

    // Eliminación permanente
    await this.tarifarioRepository.remove(tarifario);
  }
}

//proceso de guardar la info en la bd
