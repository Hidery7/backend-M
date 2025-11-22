import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TarifarioService } from './tarifario.service';
import { CreateTarifarioDto } from './dto/create-tarifario.dto';
import { UpdateTarifarioDto } from './dto/update-tarifario.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tarifarios')
export class TarifarioController {
  constructor(private readonly tarifarioService: TarifarioService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  create(@Body() createTarifarioDto: CreateTarifarioDto) {
    return this.tarifarioService.create(createTarifarioDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  findAll() {
    return this.tarifarioService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador', 'Recepcionista')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tarifarioService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTarifarioDto: UpdateTarifarioDto
  ) {
    return this.tarifarioService.update(id, updateTarifarioDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarifarioService.remove(id);
  }
}
