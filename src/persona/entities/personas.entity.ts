import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity('persona')
export class Persona {
  @PrimaryGeneratedColumn({ name: 'id_persona' })
  idPersona: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 50, nullable: false })
  tipoDocumento: string;

  @Column({ name: 'numero_documento', type: 'varchar', length: 50, nullable: false, unique: true })
  numeroDocumento: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nacionalidad: string;

  @Column({
    type: 'tinyint',
    default: 1,
    nullable: false
  })
  estado: number;

  @Column({
    name: 'correo_electronico',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true
  })
  correoElectronico: string;

  @Column({
    name: 'fecha_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false
  })
  fechaRegistro: Date;

  @OneToOne(() => Usuario, usuario => usuario.persona)
  usuario: Usuario;

  @OneToMany(() => Reserva, reserva => reserva.persona)
  reservas: Reserva[];
}
