import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { Titulacion } from 'src/titulacion/titulacion.entity';

@Entity({ name: 'estudiantes' })
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carrera: string;

  @Column()
  estado: string;

  @OneToOne(() => Persona, (persona) => persona.estudiante, { cascade: true })
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @OneToOne(() => Titulacion, (titulacion) => titulacion.estudiante, {
    cascade: true,
  })
  titulacion: Titulacion;
}
