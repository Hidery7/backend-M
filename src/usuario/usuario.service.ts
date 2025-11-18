import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';          //logica prncipal, valida usuarios y enlaza con la bd
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';         //persona almacena tanto como cliente y empleado, por algo tiene una relacion
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    // En usuario.service.ts (backend)
async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    
    // Recargar el usuario con las relaciones
    const usuarioCompleto = await this.usuarioRepository.findOne({
        where: { idUsuario: usuarioGuardado.idUsuario },
        relations: ['rol', 'persona'],
    });

    // Verificar que el usuario existe
    if (!usuarioCompleto) {
        throw new NotFoundException(`Usuario con ID ${usuarioGuardado.idUsuario} no encontrado después de crearlo`);
    }

    return usuarioCompleto;
}

    /**Obtiene todos los usuarios
    @returns Lista de usuarios
     */
    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: ['rol', 'persona'],
        });
    }

    /**Busca un usuario por su ID
    @param id ID del usuario
    @returns Usuario encontrado
    @throws NotFoundException si el usuario no existe
     */
    async findOne(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { idUsuario: id },
            relations: ['rol', 'persona'],
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return usuario;
    }

    /**
     * Busca un usuario por su nombre de usuario
     * @param nombre Nombre de usuario
     * @returns Usuario encontrado o null
     */
    async findOneByNombre(nombre: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: { nombre },
            relations: ['rol']
        });
    }

    /**
     * Actualiza un usuario existente
     * @param id ID del usuario a actualizar
     * @param updateUsuarioDto 
     * @returns
     * @throws
     */
    async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
        const usuario = await this.findOne(id);

        // Actualiza solo los campos proporcionados
        Object.assign(usuario, updateUsuarioDto);

        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario
     * @param id ID del usuario a eliminar
     * @returns Resultado de la operación
     * @throws NotFoundException si el usuario no existe
     */
    async remove(id: number): Promise<void> {
        const result = await this.usuarioRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
    }

    /**
     * Desactiva un usuario (cambia su estado a inactivo)
     * @param id ID del usuario a desactivar
     * @returns Usuario actualizado
     */
    async deactivate(id: number): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.estado = 0;
        return await this.usuarioRepository.save(usuario);
    }

    /**
     * Reactiva un usuario (cambia su estado a activo)
     * @param id ID del usuario a reactivar
     * @returns Usuario actualizado
     */
    async activate(id: number): Promise<Usuario> {
        const usuario = await this.findOne(id);
        usuario.estado = 1;
        return await this.usuarioRepository.save(usuario);
    }
}
