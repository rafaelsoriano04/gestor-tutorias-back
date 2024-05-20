import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Persona } from './persona.entity';

@Entity({name : 'docentes'})
export class Docente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'cargo' })
    cargo: string;

    @OneToOne(()=> Persona, { cascade: true })
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;
}
