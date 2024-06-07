import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Informe } from './informe.entity';

@Entity({ name: 'actividades' })
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  descripcion: string;

  @Column({ type: 'date' })
  fecha_actividad: Date;

  @ManyToOne(() => Informe, (informe) => informe.actividades)
  @JoinColumn({ name: 'id_informe' })
  informe: Informe;
}
