import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Persona } from './persona.entity';

@Entity({ name: 'docentes' })
export class Docente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, name: 'nombre_usuario' })
    nombre_usuario: string;

    @Column({ name: 'contrasenia' })
    contrasenia: string;

    @Column({ name: 'cargo' })
    cargo: string;

    @OneToOne(() => Persona, { cascade: true })
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;
}
