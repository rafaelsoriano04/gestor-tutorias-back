import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Informe } from './informe.entity';
import { InformeDto } from './dto/informe.dto';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Titulacion } from 'src/titulacion/titulacion.entity';

@Injectable()
export class InformeService {
  constructor(
    @InjectRepository(Informe)
    private informeRepository: Repository<Informe>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Titulacion)
    private titulacionRepository: Repository<Titulacion>,
  ) {}

  // Encontrar el informe por estudiante
  async findByEstudianteId(estudianteId: number): Promise<Informe[]> {
    return this.informeRepository.find({
      where: { titulacion: { estudiante: { id: estudianteId } } },
    });
  }

  // ENCONTRAR INFORME POR EL TEMA (POR SI ACASO JEEJE)
  async findByTitulacionTema(tema: string): Promise<Informe[]> {
    return this.informeRepository
      .createQueryBuilder('informe')
      .innerJoinAndSelect('informe.titulacion', 'titulacion')
      .where('titulacion.tema = :tema', { tema })
      .getMany();
  }

  //ENCONTRAR EL INFORME POR ID
  async findById(id: number): Promise<Informe> {
    const informe = await this.informeRepository.findOne({
      where: { id },
    });
    if (!informe) {
      throw new NotFoundException(`La id del informe es incorrecta`);
    }
    return informe;
  }

  //CREAR EL INFORME
  async createInforme(informeDto: InformeDto): Promise<Informe> {
    const informe = new Informe();
    informe.anexo = informeDto.anexo;
    informe.fecha = informeDto.fecha;
    informe.porcentaje_avance = informeDto.porcentaje_avance;

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: informeDto.id_estudiante },
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const titulacion = await this.titulacionRepository.findOne({
      where: { id: informeDto.id_titulacion },
    });

    if (!titulacion) {
      throw new NotFoundException('Titulación no encontrada');
    }

    informe.titulacion.estudiante = estudiante;
    informe.titulacion = titulacion;

    return await this.informeRepository.save(informe);
  }
}
