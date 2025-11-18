import { Habitacion } from "src/habitacion/entities/habitacion.entity";
import { Tarifario } from "src/tarifario/entities/tarifario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo_habitacion')
export class TipoHabitacion {

    @PrimaryGeneratedColumn({ name: 'tipo_habitacion_id' })
    tipoHabitacionId: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    nombre: string;

    // Relaciones
    @OneToMany(() => Habitacion, habitacion => habitacion.tipoHabitacion)
    habitaciones: Habitacion[];

    @OneToMany(() => Tarifario, tarifario => tarifario.tipoHabitacion)
    tarifarios: Tarifario[];
}