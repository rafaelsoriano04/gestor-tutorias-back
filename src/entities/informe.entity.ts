import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Actividad } from './actividad.entity';

@Entity({name : 'informes'})
export class Informe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  anexo: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  porcentaje_avance: number;

  @JoinColumn({ name: 'id_estudiante' })
  estudiante: number;

  @OneToMany(() => Actividad, actividad => actividad.informe)
  actividades: Actividad[];
}
