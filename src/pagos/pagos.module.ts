import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pagos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
  ],
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule {}
