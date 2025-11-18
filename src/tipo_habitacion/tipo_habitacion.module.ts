import { Module } from '@nestjs/common';
import { TipoHabitacionService } from './tipo_habitacion.service';
import { TipoHabitacion } from './entities/tipo_habitacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHabitacionController } from './tipo_habitacion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoHabitacion])
  ],
  controllers: [TipoHabitacionController],
  providers: [TipoHabitacionService],
  exports: [TipoHabitacionService]
})
export class TipoHabitacionModule {}
