import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, LessThan, MoreThan, Not, Repository } from 'typeorm';
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
      relations: ['titulacion', 'titulacion.estudiante'], // Asegúrate de cargar las relaciones necesarias
      where: { titulacion: { estudiante: { id: estudianteId } } },
      order: { fecha: 'ASC' },
    });
  }

  // ENCONTRAR INFORME POR EL TEMA (POR SI ACASO JEEJE)
  async findByTitulacionTema(tema: string): Promise<Informe[]> {
    return this.informeRepository
      .createQueryBuilder('informe')
      .innerJoinAndSelect('informe.titulacion', 'titulacion')
      .where('titulacion.tema = :tema', { tema })
      .orderBy('fecha')
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
  async createInforme(request: InformeDto): Promise<Informe> {
    const informe = new Informe();
    informe.anexo = request.anexo;
    informe.fecha = request.fecha;
    informe.porcentaje_avance = request.porcentaje_avance;
    informe.actividades = request.actividades;

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: request.id_estudiante },
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const titulacion = await this.titulacionRepository.findOne({
      where: { id: request.id_titulacion },
    });

    if (!titulacion) {
      throw new NotFoundException('Titulación no encontrada');
    }

    const fechaActual = new Date(request.fecha);

    const primerDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      1,
    );
    const ultimoDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      0,
    );

    const informeMes = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMes, ultimoDiaMes),
        titulacion,
      },
    });

    if (informeMes) {
      throw new ConflictException('Ya existe un informe de este mes');
    }

    const informeMasProximoAnterior = await this.informeRepository.findOne({
      where: {
        fecha: LessThan(fechaActual),
        titulacion,
      },
      order: {
        fecha: 'DESC', // Orden descendente para obtener el más reciente
      },
    });

    if (
      informeMasProximoAnterior &&
      informeMasProximoAnterior.porcentaje_avance >= request.porcentaje_avance
    ) {
      throw new ConflictException(
        `El porcentaje de avance debe ser mayor al del último informe: ${informeMasProximoAnterior.porcentaje_avance}%`,
      );
    }

    const informeMasProximoPosterior = await this.informeRepository.findOne({
      where: {
        fecha: MoreThan(fechaActual),
        titulacion,
      },
      order: {
        fecha: 'ASC', // Orden ascendente para obtener el más próximo
      },
    });

    if (
      informeMasProximoPosterior &&
      informeMasProximoPosterior.porcentaje_avance <= request.porcentaje_avance
    ) {
      throw new ConflictException(
        `El porcentaje de avance debe ser menor al del último próximo informe: ${informeMasProximoAnterior.porcentaje_avance}%`,
      );
    }

    titulacion.avance_total = request.porcentaje_avance;
    this.titulacionRepository.save(titulacion);

    // Asignamos la relación entre estudiante y titulacion antes de asignarla a informe
    titulacion.estudiante = estudiante;

    informe.titulacion = titulacion;
    informe.estado = request.estado;

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
    const ultimo = await this.informeRepository.findOne({
      where: { titulacion: { id: informe.titulacion.id } },
      order: { fecha: 'DESC' },
    });

    informe.titulacion.avance_total = ultimo ? ultimo.porcentaje_avance : 0;
    await this.titulacionRepository.save(informe.titulacion);
  }

  async update(request: Informe): Promise<Informe> {
    const informe = await this.informeRepository.findOne({
      where: { id: request.id },
      relations: ['titulacion'],
    });

    const fechaActual = new Date(request.fecha);

    const primerDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      1,
    );
    const ultimoDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      0,
    );

    const titulacion = await this.titulacionRepository.findOne({
      where: { id: informe.titulacion.id },
    });

    const informeMes = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMes, ultimoDiaMes),
        titulacion,
        id: Not(Equal(informe.id)),
      },
    });

    if (informeMes) {
      throw new ConflictException('Ya existe un informe de este mes');
    }

    const informeMasProximoAnterior = await this.informeRepository.findOne({
      where: {
        fecha: LessThan(fechaActual),
        titulacion,
        id: Not(Equal(informe.id)),
      },
      order: {
        fecha: 'DESC',
      },
    });

    if (
      informeMasProximoAnterior &&
      informeMasProximoAnterior.porcentaje_avance >= request.porcentaje_avance
    ) {
      throw new ConflictException(
        `El porcentaje de avance debe ser mayor al del último informe: ${informeMasProximoAnterior.porcentaje_avance}%`,
      );
    }

    const informeMasProximoPosterior = await this.informeRepository.findOne({
      where: {
        fecha: MoreThan(fechaActual),
        titulacion,
        id: Not(Equal(informe.id)),
      },
      order: {
        fecha: 'ASC',
      },
    });

    if (
      informeMasProximoPosterior &&
      informeMasProximoPosterior.porcentaje_avance <= request.porcentaje_avance
    ) {
      throw new ConflictException(
        `El porcentaje de avance debe ser menor al del último próximo informe: ${informeMasProximoPosterior.porcentaje_avance}%`,
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

    if (!informeMasProximoPosterior) {
      titulacion.avance_total = request.porcentaje_avance;
    }

    await this.titulacionRepository.save(titulacion);

    informe.fecha = request.fecha;
    informe.porcentaje_avance = request.porcentaje_avance;
    informe.estado = request.estado;

    return await this.informeRepository.save(informe);
  }
}
