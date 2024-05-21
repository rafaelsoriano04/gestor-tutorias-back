import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docente } from 'src/entities/docente.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()

export class DocenteService {
  constructor(
    @InjectRepository(Docente) private docentesRepository: Repository<Docente>,
  ) {}
  
  
  async save(docente: any): Promise<Docente> {
    if (!docente) {
      throw new BadRequestException('Datos faltantes');
    }

    if (docente.persona && docente.persona.identificacion.length !== 10) {
      throw new BadRequestException('El numero de identificacion no es valido');
    }

    if (docente.contrasenia) {
      // Hashear la contraseña antes de guardarla
      const salt = await bcrypt.genSalt();
      docente.contrasenia = await bcrypt.hash(docente.contrasenia, salt);
    }

    return this.docentesRepository.save(docente);
  }

  async findOneByUsername(
    nombre_usuario: string,
  ): Promise<Docente | undefined> {
    return this.docentesRepository.findOne({ where: { nombre_usuario } });
  }
}
