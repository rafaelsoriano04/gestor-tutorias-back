import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Informe } from './informe.entity';

@Entity({name : 'actividades'})
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: "titulo"})
  titulo: string;

  @Column({name: "descripcion"})
  descripcion: string;

  @ManyToOne(() => Informe, informe => informe.actividades)
  @JoinColumn({name: 'id_informe'})
  informe: Informe;
}
