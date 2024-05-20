import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Docente } from './docente.entity';

@Entity({name : 'usuarios'})
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nombre_usuario' })
    nombreUsuario: string;

    @Column({ name: 'contrasenia' })
    contrasena: string;

    @OneToOne(()=> Docente, { cascade: true })
    @JoinColumn({ name: 'id_docente' })  
    docente: Docente;
}

