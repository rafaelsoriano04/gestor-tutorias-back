import { Persona } from 'src/persona/persona.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Titulacion } from 'src/titulacion/titulacion.entity';

@Entity({ name: 'docentes' })
export class Docente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'nombre_usuario' })
  nombre_usuario: string;

  @Column({ name: 'contrasenia' })
  contrasenia: string;

  @OneToOne(() => Persona, (persona) => persona.docente, { cascade: true })
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;

  @OneToMany(() => Titulacion, (titulacion) => titulacion.docente)
  titulacion: Titulacion[];
}
