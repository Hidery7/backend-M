import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaController } from './persona.controller';
import { PersonaService } from './persona.service';
import { Persona } from './entities/personas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona])
  ],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [PersonaService] // Exportamos el servicio para que otros módulos puedan usarlo
})
export class PersonaModule {}
