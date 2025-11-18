import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifarioController } from './tarifario.controller';
import { TarifarioService } from './tarifario.service';
import { Tarifario } from './entities/tarifario.entity';
import { TipoHabitacionModule } from 'src/tipo_habitacion/tipo_habitacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarifario]),
    TipoHabitacionModule
  ],
  controllers: [TarifarioController],
  providers: [TarifarioService],
  exports: [TarifarioService]
})
export class TarifarioModule {}
