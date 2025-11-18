import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  /**
   * Crea un nuevo rol
   * @param createRolDto Datos para crear el rol
   * @returns El rol creado
   */
  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  /**
   * Obtiene todos los roles
   * @returns Lista de roles
   */
  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({
      relations: ['usuarios'],
      order: { idRol: 'ASC' },
    });
  }

  /**
   * Busca un rol por su ID
   * @param id ID del rol a buscar
   * @returns El rol encontrado
   * @throws NotFoundException si el rol no existe
   */
  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { idRol: id },
      relations: ['usuarios'],
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  /**
   * Actualiza un rol existente
   * @param id ID del rol a actualizar
   * @param updateRolDto Datos para actualizar el rol
   * @returns El rol actualizado
   */
  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);
    
    // Actualiza solo los campos proporcionados
    Object.assign(rol, updateRolDto);
    
    return await this.rolRepository.save(rol);
  }

  /**
   * Elimina un rol
   * @param id ID del rol a eliminar
   * @throws NotFoundException si el rol no existe
   */
  async remove(id: number): Promise<void> {
    const result = await this.rolRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  }

  /**
   * Desactiva un rol (cambia su estado a inactivo)
   * @param id ID del rol a desactivar
   * @returns El rol actualizado
   */
  async deactivate(id: number): Promise<Rol> {
    const rol = await this.findOne(id);
    rol.estado = 0;
    return await this.rolRepository.save(rol);
  }

  /**
   * Reactiva un rol (cambia su estado a activo)
   * @param id ID del rol a reactivar
   * @returns El rol actualizado
   */
  async activate(id: number): Promise<Rol> {
    const rol = await this.findOne(id);
    rol.estado = 1;
    return await this.rolRepository.save(rol);
  }
}
