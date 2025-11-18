import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { ReservaService } from './reserva.service';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reserva')
export class ReservaController {

    constructor(private readonly reservaService: ReservaService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        createReservaDto: CreateReservaDto
    ) {
        return this.reservaService.create(createReservaDto);
    }

    @Get()
    findAll() {
        return this.reservaService.findAll();
    }

    @Get('activas')
    findActivas() {
        return this.reservaService.findActivas();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reservaService.findOne(id);
    }

    @Get('persona/:idPersona')
    findByPersona(@Param('idPersona', ParseIntPipe) idPersona: number) {
        return this.reservaService.findByPersona(idPersona);
    }

    @Get('habitacion/:idHabitacion')
    findByHabitacion(@Param('idHabitacion', ParseIntPipe) idHabitacion: number) {
        return this.reservaService.findByHabitacion(idHabitacion);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updateReservaDto: UpdateReservaDto,
    ) {
        return this.reservaService.update(id, updateReservaDto);
    }

    @Patch(':id/estado/:estado')
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Param('estado', ParseIntPipe) estado: number,
    ) {
        return this.reservaService.cambiarEstado(id, estado);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.reservaService.remove(id);
    }
}
