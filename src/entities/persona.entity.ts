import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity({name : 'personas'})
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identificacion: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

}

