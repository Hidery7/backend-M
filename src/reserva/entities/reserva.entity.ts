import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Persona } from '../../persona/entities/personas.entity';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Pago } from '../../pagos/entities/pagos.entity';

@Entity('reserva')
export class Reserva {

  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  idReserva: number;

  @Column({ name: 'id_persona', type: 'int', nullable: false })
  idPersona: number;

  @Column({ name: 'id_habitacion', type: 'int', nullable: false })
  idHabitacion: number;

  @Column({ name: 'id_usuario', type: 'int', nullable: false })
  idUsuario: number;

  @Column({ name: 'fecha_entrada', type: 'datetime', nullable: false })
  fechaEntrada: Date;

  @Column({ name: 'fecha_salida', type: 'datetime', nullable: false })
  fechaSalida: Date;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  // Relations
  @ManyToOne(() => Persona, persona => persona.reservas)
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @ManyToOne(() => Habitacion, habitacion => habitacion.reservas)
  @JoinColumn({ name: 'id_habitacion' })
  habitacion: Habitacion;

  @ManyToOne(() => Usuario, usuario => usuario.reservas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Pago, (pago: Pago) => pago.reserva)
  pagos: Pago[];
}
