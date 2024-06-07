import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Informe } from '../informe/informe.entity';
import { Repository } from 'typeorm';
import { Titulacion } from 'src/titulacion/titulacion.entity';
import { TitulacionDto } from 'src/titulacion/dto/titulacion.dto';

@Injectable()
export class TitulacionService {
  constructor(
    @InjectRepository(Titulacion)
    private titulacionRepository: Repository<Titulacion>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Informe)
    private informeRepository: Repository<Informe>,
  ) {}

  async getAll(): Promise<Titulacion[]> {
    return await this.titulacionRepository.find();
  }

  async getByEstudiante(id: number): Promise<Titulacion> {
    const titulacion = await this.titulacionRepository.findOne({
      where: { estudiante: { id: id } },
    });
    if (!titulacion) {
      throw new NotFoundException('El estudiante no tiene tema asignado');
    }
    return titulacion;
  }

  async createTitulacion(createTema: Titulacion) {
    const tituloExist = await this.titulacionRepository.findOne({
      where: { tema: createTema.tema },
    });
    if (tituloExist) {
      throw new BadRequestException('El proyecto ya existe');
    }
    return await this.titulacionRepository.save(createTema);
  }

  /* async updateTitulacion(id: number, updateTitulacion: TitulacionDto) {
    const tema = updateTitulacion;
    const temaFind = this.titulacionRepository.findOne({
      where: { id_estudiante },
    });
    if (!temaFind) {
      throw new NotFoundException('');
    }
  }*/
}
