import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Informe } from '../entities/informe.entity';
import { Persona } from '../entities/persona.entity';
import { Docente } from 'src/docente/docente.entity';
import { Titulacion } from 'src/entities/titulacion.entity';

@Entity({ name: 'estudiantes' })
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha_aprobacion: Date;

  @Column()
  carrera: string;

  @Column()
  tema: string;

  @Column()
  estado: string;

  @Column()
  porcentaje: number;

  @JoinColumn({ name: 'id_docente' })
  @ManyToOne(() => Docente, (docente) => docente.estudiantes)
  docente: Docente;

  @OneToOne(() => Persona, (persona) => persona.estudiante, { cascade: true })
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @OneToMany(() => Informe, (informe) => informe.estudiante, { cascade: true })
  informes: Informe[];

  @OneToOne(() => Titulacion, (titulacion) => titulacion.estudiante)
  @JoinColumn({ name: 'id_titulacion' })
  titulacion: Titulacion;
}
