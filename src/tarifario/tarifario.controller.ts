import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TarifarioService } from './tarifario.service';
import { CreateTarifarioDto } from './dto/create-tarifario.dto';
import { UpdateTarifarioDto } from './dto/update-tarifario.dto';

@Controller('tarifarios')
export class TarifarioController {
  constructor(private readonly tarifarioService: TarifarioService) {}

  @Post()
  create(@Body() createTarifarioDto: CreateTarifarioDto) {
    return this.tarifarioService.create(createTarifarioDto);
  }

  @Get()
  findAll() {
    return this.tarifarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tarifarioService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTarifarioDto: UpdateTarifarioDto
  ) {
    return this.tarifarioService.update(id, updateTarifarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarifarioService.remove(id);
  }
}

//decoradores
//guards