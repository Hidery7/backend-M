import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tarifario } from '../../tarifario/entities/tarifario.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { TipoHabitacion } from 'src/tipo_habitacion/entities/tipo_habitacion.entity';

export enum EstadoHabitacion {
  DISPONIBLE = 'Disponible',
  OCUPADA = 'Ocupada',
  RESERVADO = 'Reservado'
}

@Entity('habitacion')
export class Habitacion {
  @PrimaryGeneratedColumn({ name: 'id_habitacion' })
  idHabitacion: number;

  @Column({ name: 'tipo_habitacion_id', type: 'int', nullable: false })
  tipoHabitacionId: number;

  @Column({ type: 'int', nullable: false })
  piso: number;

  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  numero: string;

  @Column({ name: 'estado_actividad', type: 'tinyint', default: 1, nullable: false  })
  estadoActividad: number;

  @Column({
    type: 'enum',
    enum: EstadoHabitacion,
    default: EstadoHabitacion.DISPONIBLE
  })
  estado: EstadoHabitacion;

  @ManyToOne(() => TipoHabitacion, tipoHabitacion => tipoHabitacion.habitaciones)
  @JoinColumn({ name: 'tipo_habitacion_id' })
  tipoHabitacion: TipoHabitacion;

  @OneToMany(() => Reserva, (reserva: Reserva) => reserva.habitacion)
  reservas: Reserva[];
}
