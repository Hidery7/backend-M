import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  idRol: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  nombre: string;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];
}
