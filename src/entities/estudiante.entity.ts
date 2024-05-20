import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';

@Entity({name : 'estudiantes'})
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
  docente: number;

  @JoinColumn({ name: 'id_persona' })
  persona: number;
}
