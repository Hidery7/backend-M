import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TipoHabitacionService } from './tipo_habitacion.service';
import { TipoHabitacion } from './entities/tipo_habitacion.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tipo-habitacion')
export class TipoHabitacionController {
    constructor(private readonly tipoHabitacionService: TipoHabitacionService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('Administrador')
    async findAll(): Promise<TipoHabitacion[]> {
        return this.tipoHabitacionService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('Administrador', 'Recepcionista')
    async findOne(@Param('id') id: string): Promise<TipoHabitacion> {
        return this.tipoHabitacionService.findOne(+id);
    }
}
