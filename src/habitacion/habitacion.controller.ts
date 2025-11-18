import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { HabitacionService } from './habitacion.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';

@Controller('habitacion')
export class HabitacionController {
    constructor(private readonly habitacionService: HabitacionService) { }

    @Post()
    async crear(@Body() createHabitacionDto: CreateHabitacionDto) {
        return await this.habitacionService.create(createHabitacionDto);
    }

    @Get()
    async obtenerTodos() {
        return await this.habitacionService.findAll();
    }

    @Get('disponibles')
    async obtenerDisponibles() {
        return await this.habitacionService.findDisponibles();
    }

    @Get(':id')
    async obtenerUno(@Param('id', ParseIntPipe) id: number) {
        return await this.habitacionService.findOne(id);
    }

    @Put(':id')
    async actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateHabitacionDto: UpdateHabitacionDto
    ) {
        return await this.habitacionService.update(id, updateHabitacionDto);
    }

    @Patch(':id/estado')
    async actualizarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string
    ) {
        return await this.habitacionService.update(id, { estado: estado as any });
    }

    // ✅ NUEVO: Endpoint para forzar actualización de estados
    @Post('actualizar-estados')
    async forzarActualizacionEstados() {
        await this.habitacionService.forzarActualizacionEstados();
        return { message: 'Estados de habitaciones actualizados correctamente' };
    }

    @Delete(':id')
    async eliminar(@Param('id', ParseIntPipe) id: number) {
        await this.habitacionService.remove(id);
        return { message: 'Habitación eliminada correctamente' };
    }
}
