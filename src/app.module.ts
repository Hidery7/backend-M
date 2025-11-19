import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PersonaModule } from './persona/persona.module';
import { RolModule } from './rol/rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TarifarioModule } from './tarifario/tarifario.module';
import { HabitacionModule } from './habitacion/habitacion.module';
import { ReservaModule } from './reserva/reserva.module';
import { PagosModule } from './pagos/pagos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHabitacionModule } from './tipo_habitacion/tipo_habitacion.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'sistema_reserva_hotel',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,   
      logging: false,
    }),
    AuthModule, 
    PersonaModule, 
    RolModule, 
    UsuarioModule, 
    TarifarioModule, 
    HabitacionModule, 
    ReservaModule,
    PagosModule,
    TipoHabitacionModule,  // Asegúrate de que esté en la lista
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
