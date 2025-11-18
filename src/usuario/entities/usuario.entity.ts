import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Persona } from '../../persona/entities/personas.entity';
import { Rol } from '../../rol/entities/rol.entity';                        //representan las tablas de mi base de datos.                                                  
import { Reserva } from '../../reserva/entities/reserva.entity';            
import { Pago } from '../../pagos/entities/pagos.entity';                  

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ name: 'id_rol', type: 'int', nullable: false })
  idRol: number;

  @Column({ name: 'id_persona', type: 'int', nullable: false, unique: true })
  idPersona: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  // Relations
  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @OneToOne(() => Persona, persona => persona.usuario)
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @OneToMany(() => Reserva, (reserva: Reserva) => reserva.usuario)
  reservas: Reserva[];

  @OneToMany(() => Pago, (pago: Pago) => pago.usuario)
  pagos: Pago[];
}
