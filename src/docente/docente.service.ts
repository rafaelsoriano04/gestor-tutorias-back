import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docente } from 'src/entities/docente.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DocenteDto } from 'src/dtos/docente.dto';
@Injectable()

export class DocenteService {
  constructor(
    @InjectRepository(Docente) private docentesRepository: Repository<Docente>,
  ) { }


  async save(docenteDto: DocenteDto): Promise<Docente> {

    const salt = await bcrypt.genSalt();
    docenteDto.contrasenia = await bcrypt.hash(docenteDto.contrasenia, salt);

    const newDocente = this.docentesRepository.create(docenteDto); // Crear una nueva instancia de Docente
    return this.docentesRepository.save(newDocente); // Guardar la instancia en la base de datos
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
  

}
