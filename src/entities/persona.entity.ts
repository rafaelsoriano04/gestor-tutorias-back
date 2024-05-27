import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Docente } from './docente.entity';

@Entity({name : 'personas'})
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  identificacion: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @OneToOne(() => Estudiante, estudiante => estudiante.persona)
  estudiante: Estudiante;

  @OneToOne(() => Docente, docente => docente.persona)
  docente: Docente;

}

