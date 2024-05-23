import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { Docente } from './docente.entity';
import { Informe } from './informe.entity';
import { Persona } from './persona.entity';

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
  @ManyToOne(() => Docente, docente => docente.estudiantes)
  docente: Docente;

  @OneToOne(() => Persona, persona => persona.estudiante, { cascade: true })
  @JoinColumn({ name: 'id_persona' })
  persona: number;

  @OneToMany(() => Informe, informe => informe.estudiante, { cascade: true })
  informes: Informe[];
}
