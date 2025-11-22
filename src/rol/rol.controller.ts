import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  ParseIntPipe, 
  UsePipes, 
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './entities/rol.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findAll(): Promise<Rol[]> {
    return this.rolService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<Rol> {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolService.remove(id);
  }

  @Put(':id/desactivar')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolService.deactivate(id);
  }

  @Put(':id/activar')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  async activate(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolService.activate(id);
  }
}
