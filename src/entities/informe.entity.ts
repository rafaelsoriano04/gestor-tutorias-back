import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Actividad } from './actividad.entity';
import { Titulacion } from './titulacion.entity';

@Entity({ name: 'informes' })
export class Informe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  anexo: string;

  @Column({ type: 'decimal' })
  porcentaje_avance: number;

  @Column({ type: 'date' })
  fecha: Date;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.informes)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;

  @ManyToOne(() => Titulacion, (titulacion) => titulacion.informes)
  @JoinColumn({ name: 'id_titulacion' })
  titulacion: Titulacion;

  @OneToMany(() => Actividad, (actividad) => actividad.informe)
  actividades: Actividad[];
}
