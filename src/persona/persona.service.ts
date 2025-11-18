import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'; //logica prncipal, valida usuarios y enlaza con la bd
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/personas.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) { }

  // Crear una nueva persona
  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    // Verificar si ya existe una persona con el mismo número de documento o correo
    const [existePorDocumento, existePorCorreo] = await Promise.all([
      this.personaRepository.findOne({
        where: { numeroDocumento: createPersonaDto.numeroDocumento },
      }),
      this.personaRepository.findOne({
        where: { correoElectronico: createPersonaDto.correoElectronico },
      })
    ]);

    if (existePorDocumento) {
      throw new ConflictException('Ya existe una persona con este número de documento');
    }

    if (existePorCorreo) {
      throw new ConflictException('Ya existe una persona con este correo electrónico');
    }

    const nuevaPersona = this.personaRepository.create({
      ...createPersonaDto,
      estado: 1 // Aseguramos que el estado sea 1 por defecto
    });
    return await this.personaRepository.save(nuevaPersona);
  }

  // Obtener todas las personas
  async findAll(soloActivas: boolean = true): Promise<Persona[]> {
    const whereClause = soloActivas ? { estado: 1 } : {};

    return await this.personaRepository.find({
      where: whereClause,
      order: { apellido: 'ASC', nombre: 'ASC' },
    });
  }

  // Obtener una persona por ID
  async findOne(id: number): Promise<Persona> {
    const persona = await this.personaRepository.findOne({
      where: { idPersona: id },
    });

    if (!persona) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }

    return persona;
  }

  // Actualizar una persona
  async update(id: number, updatePersonaDto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.findOne(id);

    // Verificaciones de unicidad para número de documento
    if (updatePersonaDto.numeroDocumento && updatePersonaDto.numeroDocumento !== persona.numeroDocumento) {
      const existeConMismoDocumento = await this.personaRepository.findOne({
        where: { numeroDocumento: updatePersonaDto.numeroDocumento },
      });

      if (existeConMismoDocumento) {
        throw new ConflictException('Ya existe otra persona con este número de documento');
      }
    }

    // Verificaciones de unicidad para correo electrónico
    if (updatePersonaDto.correoElectronico && updatePersonaDto.correoElectronico !== persona.correoElectronico) {
      const existeConMismoCorreo = await this.personaRepository.findOne({
        where: { correoElectronico: updatePersonaDto.correoElectronico },
      });

      if (existeConMismoCorreo) {
        throw new ConflictException('Ya existe otra persona con este correo electrónico');
      }
    }

    Object.assign(persona, updatePersonaDto);
    return await this.personaRepository.save(persona);
  }

  // Eliminar una persona (borrado físico)
  async remove(id: number): Promise<void> {
    const persona = await this.findOne(id);
    await this.personaRepository.remove(persona);
  }

  // Método auxiliar para buscar por número de documento
  async findByDocumentNumber(numeroDocumento: string): Promise<Persona | null> {
    return await this.personaRepository.findOne({
      where: { numeroDocumento, estado: 1 },
    });
  }
}
