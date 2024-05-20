import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Informe } from './informe.entity';

@Entity({name : 'actividades'})
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => Informe, informe => informe.actividades)
  informe: Informe;
}
