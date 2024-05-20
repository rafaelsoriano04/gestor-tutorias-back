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

    async saveUsuario(usuarioData: any): Promise<Usuario> {
        return this.usuariosRepository.save(usuarioData);
      }
}

