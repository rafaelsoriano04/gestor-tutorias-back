import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DocenteDto } from './dto/docente.dto';
import { Docente } from './docente.entity';

@Injectable()
export class DocenteService {
  constructor(
    @InjectRepository(Docente) private docentesRepository: Repository<Docente>,
  ) {}

  async save(docenteDto: DocenteDto): Promise<Docente> {
    const salt = await bcrypt.genSalt();
    docenteDto.contrasenia = await bcrypt.hash(docenteDto.contrasenia, salt);

    const existingDocenteByUsername = await this.findOneByUsername(
      docenteDto.nombre_usuario,
    );
    if (existingDocenteByUsername) {
      throw new ConflictException(
        'El nombre de usuario ya está en uso. Por favor, utiliza otro.',
      );
    }

    const existingDocenteByIdentificacion = await this.findOneByIdentificacion(
      docenteDto.persona.identificacion,
    );
    if (existingDocenteByIdentificacion) {
      throw new ConflictException('La cédula ya está en uso.');
    }

    return await this.docentesRepository.save(docenteDto);
  }

  async findOneByUsername(
    nombre_usuario: string,
  ): Promise<Docente | undefined> {
    return this.docentesRepository.findOne({ where: { nombre_usuario } });
  }

  async findOneById(id: number): Promise<Docente | undefined> {
    return this.docentesRepository.findOne({ where: { id } });
  }

  async findOneByIdWithPersona(id: number): Promise<Docente | undefined> {
    return this.docentesRepository.findOne({
      where: { id },
      relations: ['persona'],
    });
  }

  async findOneByIdentificacion(
    identificacion: string,
  ): Promise<Docente | undefined> {
    return await this.docentesRepository.findOne({
      where: {
        persona: {
          identificacion,
        },
      },
      relations: ['persona'],
    });
  }
}
