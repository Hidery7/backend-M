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
  HttpStatus
} from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './entities/rol.entity';

@Controller('roles')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return this.rolService.create(createRolDto);
  }

  @Get()
  async findAll(): Promise<Rol[]> {
    return this.rolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<Rol> {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolService.remove(id);
  }

  @Put(':id/desactivar')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolService.deactivate(id);
  }

  @Put(':id/activar')
  async activate(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.rolService.activate(id);
  }
}
