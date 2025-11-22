import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { HabitacionService } from './habitacion.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('habitacion')
export class HabitacionController {
    constructor(private readonly habitacionService: HabitacionService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Administrador')
    async crear(@Body() createHabitacionDto: CreateHabitacionDto) {
        return await this.habitacionService.create(createHabitacionDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    async obtenerTodos() {
        return await this.habitacionService.findAll();
    }

    @Get('disponibles')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    async obtenerDisponibles() {
        return await this.habitacionService.findDisponibles();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    async obtenerUno(@Param('id', ParseIntPipe) id: number) {
        return await this.habitacionService.findOne(id);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador')
    async actualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateHabitacionDto: UpdateHabitacionDto
    ) {
        return await this.habitacionService.update(id, updateHabitacionDto);
    }

    @Patch(':id/estado')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    async actualizarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('estado') estado: string
    ) {
        return await this.habitacionService.update(id, { estado: estado as any });
    }

    // ✅ NUEVO: Endpoint para forzar actualización de estados
    @Post('actualizar-estados')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    async forzarActualizacionEstados() {
        await this.habitacionService.forzarActualizacionEstados();
        return { message: 'Estados de habitaciones actualizados correctamente' };
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador')
    async eliminar(@Param('id', ParseIntPipe) id: number) {
        await this.habitacionService.remove(id);
        return { message: 'Habitación eliminada correctamente' };
    }
}
