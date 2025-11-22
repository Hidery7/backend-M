import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, ValidationPipe, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    create(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        createPagoDto: CreatePagoDto
    ) {
        return this.pagosService.create(createPagoDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findAll() {
        return this.pagosService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pagosService.findOne(id);
    }

    @Get('reserva/:idReserva')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findByReserva(@Param('idReserva', ParseIntPipe) idReserva: number) {
        return this.pagosService.findByReserva(idReserva);
    }

    @Get('usuario/:idUsuario')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
        return this.pagosService.findByUsuario(idUsuario);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        updatePagoDto: UpdatePagoDto,
    ) {
        return this.pagosService.update(id, updatePagoDto);
    }

    @Patch(':id/estado/:estado')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Param('estado', ParseIntPipe) estado: number,
    ) {
        return this.pagosService.cambiarEstado(id, estado);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles('Administrador')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pagosService.remove(id);
    }
}
