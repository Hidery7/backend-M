import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TARJETA_CREDITO = 'Tarjeta de Crédito',
  TARJETA_DEBITO = 'Tarjeta de Débito',
  TRANSFERENCIA = 'Transferencia Bancaria',
  OTRO = 'Otro'
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  idPago: number;

  @Column({ name: 'id_reserva', type: 'int', nullable: false })
  idReserva: number;

  @Column({ name: 'id_usuario', type: 'int', nullable: false })
  idUsuario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  monto: number;

  @Column({ name: 'fecha_pago', type: 'date', default: () => 'CURRENT_DATE' })
  fechaPago: Date;

  @Column({
    name: 'metodo_pago',
    type: 'enum',
    enum: MetodoPago,
    default: MetodoPago.EFECTIVO
  })
  metodoPago: MetodoPago;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  // Relations
  @ManyToOne(() => Reserva, (reserva: Reserva) => reserva.pagos)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.pagos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
