import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Docente } from 'src/docente/docente.entity';
import { Informe } from '../informe/informe.entity';

@Entity({ name: 'titulacion' })
export class Titulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha_aprobacion: Date;

  @Column()
  tema: string;

  @Column()
  avance_total: number;

  @OneToOne(() => Estudiante, (estudiante) => estudiante.titulacion)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;

  @OneToOne(() => Docente, (docente) => docente.titulacion)
  @JoinColumn({ name: 'id_docente' })
  docente: Docente;

  @OneToMany(() => Informe, (informes) => informes.titulacion)
  informes: Informe[];
}
