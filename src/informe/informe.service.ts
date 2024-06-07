import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Informe } from 'src/entities/informe.entity';
import { InformeDto } from 'src/dtos/informe.dto';

@Injectable()
export class InformeService {
  constructor(
    @InjectRepository(Informe)
    private informeRepository: Repository<Informe>,
  ) {}

  //ENCONTRAR EL INFORME POR EL ID DEL ESTUDIANTE
  async findByEstudianteId(estudianteId: number): Promise<Informe[]> {
    return this.informeRepository.find({
      where: { estudiante: { id: estudianteId } },
    });
  }

  //ENCONTRAR INFORME POR EL TEMA (POR SI ACASO JEEJE)
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
  async createInforme(InformeDto: InformeDto): Promise<Informe> {
    const existingInforme = await this.informeRepository.findOne({
      where: { porcentaje_avance: InformeDto.porcentaje_avance },
    });

    if (existingInforme) {
      throw new ConflictException('Cambie el porcentaje del informe');
    }

    const informe = this.informeRepository.create(InformeDto);
    return this.informeRepository.save(informe);
  }
}
