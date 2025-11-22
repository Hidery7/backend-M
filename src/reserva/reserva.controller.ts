import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, ValidationPipe, UseGuards } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { ReservaService } from './reserva.service';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reserva')
export class ReservaController {

    constructor(private readonly reservaService: ReservaService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    create(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        createReservaDto: CreateReservaDto
    ) {
        return this.reservaService.create(createReservaDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findAll() {
        return this.reservaService.findAll();
    }

    @Get('activas')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findActivas() {
        return this.reservaService.findActivas();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reservaService.findOne(id);
    }

    @Get('persona/:idPersona')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findByPersona(@Param('idPersona', ParseIntPipe) idPersona: number) {
        return this.reservaService.findByPersona(idPersona);
    }

    @Get('habitacion/:idHabitacion')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findByHabitacion(@Param('idHabitacion', ParseIntPipe) idHabitacion: number) {
        return this.reservaService.findByHabitacion(idHabitacion);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updateReservaDto: UpdateReservaDto,
    ) {
        return this.reservaService.update(id, updateReservaDto);
    }

    @Patch(':id/estado/:estado')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Param('estado', ParseIntPipe) estado: number,
    ) {
        return this.reservaService.cambiarEstado(id, estado);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles('Administrador')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.reservaService.remove(id);
    }
}
