import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Persona } from './persona.entity';
import { Estudiante } from './estudiante.entity';

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

    @OneToOne(() => Persona, persona => persona.docente, { cascade: true })
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;

    @OneToMany(() => Estudiante, estudiante => estudiante.docente, { cascade: true })
    estudiantes: Estudiante[];

}
