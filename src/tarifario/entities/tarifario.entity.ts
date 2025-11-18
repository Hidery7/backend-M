import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';
import { TipoHabitacion } from 'src/tipo_habitacion/entities/tipo_habitacion.entity';

@Entity('tarifario')
export class Tarifario {
  
  @PrimaryGeneratedColumn({ name: 'id_tarifario' })
  idTarifario: number;

  @Column({ type: 'datetime', nullable: false })
  fecha: Date;

  @Column({ name: 'costo_base', type: 'decimal', precision: 10, scale: 2, nullable: false })
  costo_base: number;  // ← Cambiar a snake_case

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  utilidad: number;

  @Column({ name: 'precio_venta', type: 'decimal', precision: 10, scale: 2, nullable: false })
  precio_venta: number;  // ← Cambiar a snake_case

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  // Columna para la relación con TipoHabitacion
  @Column({ name: 'tipo_habitacion_id', type: 'int', nullable: false })
  tipo_habitacion_id: number;

  // Relación con TipoHabitacion
  @ManyToOne(
    () => TipoHabitacion, 
    tipoHabitacion => tipoHabitacion.tarifarios,
    { 
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      eager: true  // Cargar automáticamente la relación
    }
  )
  @JoinColumn({ 
    name: 'tipo_habitacion_id',
    referencedColumnName: 'tipoHabitacionId'
  })
  tipoHabitacion: TipoHabitacion;
}
