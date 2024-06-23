import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Actividad } from '../actividad/actividad.entity';
import { Titulacion } from '../titulacion/titulacion.entity';

@Entity({ name: 'informes' })
export class Informe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  anexo: string;

  @Column({ type: 'decimal' })
  porcentaje_avance: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 12 })
  estado: string;

  @ManyToOne(() => Titulacion, (titulacion) => titulacion.informes)
  @JoinColumn({ name: 'id_titulacion' })
  titulacion: Titulacion;

  @OneToMany(() => Actividad, (actividad) => actividad.informe, {
    cascade: true,
  })
  actividades: Actividad[];
}
