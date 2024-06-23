import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Informe } from './informe.entity';
import { InformeDto } from './dto/informe.dto';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Titulacion } from 'src/titulacion/titulacion.entity';
import { Actividad } from 'src/actividad/actividad.entity';

@Injectable()
export class InformeService {
  constructor(
    @InjectRepository(Informe)
    private informeRepository: Repository<Informe>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Titulacion)
    private titulacionRepository: Repository<Titulacion>,
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
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
      throw new NotFoundException(`El id del informe es incorrecta`);
    }
    return informe;
  }

  //CREAR EL INFORME
  async createInforme(informeDto: InformeDto): Promise<Informe> {
    const informe = new Informe();
    informe.anexo = informeDto.anexo;
    informe.fecha = informeDto.fecha;
    informe.porcentaje_avance = informeDto.porcentaje_avance;
    informe.actividades = informeDto.actividades;

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

    if (titulacion.avance_total > informeDto.porcentaje_avance) {
      throw new ConflictException('Porcenteje no valido');
    }

    titulacion.avance_total = informeDto.porcentaje_avance;

    this.titulacionRepository.save(titulacion);

    // Asignamos la relación entre estudiante y titulacion antes de asignarla a informe
    titulacion.estudiante = estudiante;

    informe.titulacion = titulacion;
    informe.estado = informeDto.estado;

    return await this.informeRepository.save(informe);
  }

  async deleteInforme(id: number): Promise<void> {
    const informe = await this.informeRepository.findOne({
      where: { id },
      relations: ['actividades', 'titulacion'], // Asegúrate de cargar las actividades
    });

    if (!informe) {
      throw new NotFoundException(`Informe con ID ${id} no encontrado`);
    }

    // Primero eliminamos las actividades asociadas
    await this.actividadRepository.remove(informe.actividades);

    // Luego eliminamos el informe
    await this.informeRepository.remove(informe);

    //Obtener el ultimo informe y actualizar el valor
    const informesRestantes = await this.informeRepository.find({
      where: { titulacion: { id: informe.titulacion.id } },
    });

    if (informesRestantes.length > 0) {
      const ultimoInforme = informesRestantes[informesRestantes.length - 1];
      informe.titulacion.avance_total = ultimoInforme.porcentaje_avance;
    } else {
      informe.titulacion.avance_total = 0; // Si no quedan informes, reiniciar el avance total
    }

    await this.titulacionRepository.save(informe.titulacion);
  }

  async update(request: Informe): Promise<Informe> {
    const informe = await this.informeRepository.findOne({
      where: { id: request.id },
      relations: ['titulacion'],
    });

    const nextInforme = await this.informeRepository
      .createQueryBuilder('informe')
      .where('informe.id > :id AND informe.id_titulacion = :id_titulacion', {
        id: informe.id,
        id_titulacion: informe.titulacion.id,
      })
      .orderBy('informe.id', 'ASC')
      .getOne();

    if (
      nextInforme &&
      nextInforme.porcentaje_avance <= request.porcentaje_avance
    ) {
      throw new ConflictException(
        'El porcentaje es igual o mayor al del informe siguiente.',
      );
    }

    request.actividades.map(async (actividad) => {
      if (actividad.id) {
        const actividadExistente = await this.actividadRepository.findOneBy({
          id: actividad.id,
        });
        actividadExistente.descripcion = actividad.descripcion;
        actividadExistente.fecha_actividad = actividad.fecha_actividad;
        this.actividadRepository.save(actividad);
      } else {
        actividad.informe = request;
        this.actividadRepository.save(actividad);
      }
    });

    informe.fecha = request.fecha;
    informe.porcentaje_avance = request.porcentaje_avance;
    informe.estado = request.estado;

    return await this.informeRepository.save(informe);
  }
}
