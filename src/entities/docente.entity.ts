import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Persona } from './persona.entity';

@Entity()
export class Docente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'cargo' })
    cargo: string;

    @OneToOne(()=> Persona)
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;
}
