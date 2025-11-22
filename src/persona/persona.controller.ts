import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('personas')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Post() //enviar datos
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async create(@Body() createPersonaDto: CreatePersonaDto) {
    return await this.personaService.create(createPersonaDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findAll(@Query('activas') activas?: string) {
    // Por defecto solo devuelve activas si no se especifica
    const soloActivas = activas === undefined ? true : activas === 'true';
    return await this.personaService.findAll(soloActivas);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.personaService.findOne(id);
  }

  @Patch(':id') //actualizar datos
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonaDto: UpdatePersonaDto,
  ) {
    return await this.personaService.update(id, updatePersonaDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.personaService.remove(id);
    return { message: 'Persona eliminada exitosamente' };
  }
} //define rutas del http
