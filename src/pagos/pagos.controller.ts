import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        createPagoDto: CreatePagoDto
    ) {
        return this.pagosService.create(createPagoDto);
    }

    @Get()
    findAll() {
        return this.pagosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pagosService.findOne(id);
    }

    @Get('reserva/:idReserva')
    findByReserva(@Param('idReserva', ParseIntPipe) idReserva: number) {
        return this.pagosService.findByReserva(idReserva);
    }

    @Get('usuario/:idUsuario')
    findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
        return this.pagosService.findByUsuario(idUsuario);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updatePagoDto: UpdatePagoDto,
    ) {
        return this.pagosService.update(id, updatePagoDto);
    }

    @Patch(':id/estado/:estado')
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Param('estado', ParseIntPipe) estado: number,
    ) {
        return this.pagosService.cambiarEstado(id, estado);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pagosService.remove(id);
    }
}
