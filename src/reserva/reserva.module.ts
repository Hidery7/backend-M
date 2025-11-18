import { forwardRef, Module } from '@nestjs/common';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva]),
  ],
  controllers: [ReservaController],
  providers: [ReservaService]
})
export class ReservaModule {}
