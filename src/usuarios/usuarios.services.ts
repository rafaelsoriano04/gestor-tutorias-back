import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docente } from 'src/entities/docente.entity';
import { Persona } from 'src/entities/persona.entity';
import { Usuario } from 'src/entities/usuario.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
        @InjectRepository(Persona) private personasRepository: Repository<Persona>,
        @InjectRepository(Docente) private docentesRepository: Repository<Docente>
    ) {}

    async registerUser(userData: { identificacion: string; nombre: string; apellido: string; telefono: string; email: string; nombreUsuario: string; contrasena: string; cargo: string }): Promise<Usuario> {
        const newPersona = this.personasRepository.create({
            identificacion: userData.identificacion,
            nombre: userData.nombre,
            apellido: userData.apellido,
            telefono: userData.telefono,
            email: userData.email
        });

        await this.personasRepository.save(newPersona);

        console.log(newPersona.id);
        
        const newDocente = this.docentesRepository.create({
            cargo: userData.cargo,
            persona: newPersona
        });
        
        await this.docentesRepository.save(newDocente);

        const newUser = this.usuariosRepository.create({
            nombreUsuario: userData.nombreUsuario,
            contrasena: userData.contrasena,
            docente: newDocente
        });


        return this.usuariosRepository.save(newUser);
    }
}

