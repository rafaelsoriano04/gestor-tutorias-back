import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Informe } from '../informe/informe.entity';
import { Repository } from 'typeorm';
import { Titulacion } from 'src/titulacion/titulacion.entity';

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

  async createTitulacion(titulacion: Titulacion) {
    return await this.titulacionRepository.save(titulacion);
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
