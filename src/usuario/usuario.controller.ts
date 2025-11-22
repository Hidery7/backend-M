import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UsePipes, ValidationPipe, UseGuards}
from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('usuarios')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Get('nombre/:nombre')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findByNombre(@Param('nombre') nombre: string): Promise<Usuario | null> {
    return this.usuarioService.findOneByNombre(nombre);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuarioService.remove(id);
  }

  @Put(':id/desactivar')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.deactivate(id);
  }

  @Put(':id/activar')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async activate(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.activate(id);
  }
} //define rutas del http
