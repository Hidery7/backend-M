import { Module } from '@nestjs/common';
import { HabitacionController } from './habitacion.controller';
import { HabitacionService } from './habitacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habitacion } from './entities/habitacion.entity';
import { TipoHabitacionModule } from 'src/tipo_habitacion/tipo_habitacion.module';
import { Reserva } from 'src/reserva/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habitacion, Reserva]),
    TipoHabitacionModule
  ],
  controllers: [HabitacionController],
  providers: [HabitacionService],
  exports: [HabitacionService]
})
export class HabitacionModule {}
