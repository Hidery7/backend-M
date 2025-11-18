import { Controller, Get, Param } from '@nestjs/common';
import { TipoHabitacionService } from './tipo_habitacion.service';
import { TipoHabitacion } from './entities/tipo_habitacion.entity';

@Controller('tipo-habitacion')
export class TipoHabitacionController {
    constructor(private readonly tipoHabitacionService: TipoHabitacionService) { }

    @Get()
    async findAll(): Promise<TipoHabitacion[]> {
        return this.tipoHabitacionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<TipoHabitacion> {
        return this.tipoHabitacionService.findOne(+id);
    }
}
