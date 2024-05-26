import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Actividad } from './actividad.entity';
import { Estudiante } from './estudiante.entity';

@Entity({ name: 'informes' })
export class Informe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'anexo' })
  anexo: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'porcentaje_avance' })
  porcentaje_avance: number;

  @ManyToOne(() => Estudiante, estudiante => estudiante.informes)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: number;

  @OneToMany(() => Actividad, actividad => actividad.informe, { cascade: true })
  actividades: Actividad[];
}
