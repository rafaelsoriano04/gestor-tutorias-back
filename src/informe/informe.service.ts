import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

    const informeDtoFecha = new Date(informeDto.fecha);
    const primerDiaMes = new Date(
      informeDtoFecha.getFullYear(),
      informeDtoFecha.getMonth(),
      1,
    );
    const ultimoDiaMes = new Date(
      informeDtoFecha.getFullYear(),
      informeDtoFecha.getMonth() + 1,
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

    const fechaActual = new Date(informeDto.fecha);

    const primerDiaMesAnterior = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 1, // Se resta uno para obtener el mes anterior
      1,
    );

    const ultimoDiaMesAnterior = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      0,
    );

    const primerDiaMesSiguiente = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      1,
    );

    const ultimoDiaMesSiguiente = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 2,
      0,
    );

    const informeMesAnterior = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMesAnterior, ultimoDiaMesAnterior),
        titulacion,
      },
    });

    const informeMesSiguiente = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMesSiguiente, ultimoDiaMesSiguiente),
        titulacion,
      },
    });

    if (informeMesAnterior) {
      if (
        informeMesAnterior.porcentaje_avance >= informeDto.porcentaje_avance
      ) {
        throw new ConflictException(
          `El porcentaje de avance debe ser mayor al del mes anterior: ${informeMesAnterior.porcentaje_avance}%`,
        );
      }
    }

    if (informeMesSiguiente) {
      if (
        informeMesSiguiente.porcentaje_avance <= informeDto.porcentaje_avance
      ) {
        throw new ConflictException(
          `El porcentaje de avance debe ser menor al del mes siguiente: ${informeMesSiguiente.porcentaje_avance}%`,
        );
      }
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

    const informeDtoFecha = new Date(request.fecha);
    const primerDiaMes = new Date(
      informeDtoFecha.getFullYear(),
      informeDtoFecha.getMonth(),
      1,
    );
    const ultimoDiaMes = new Date(
      informeDtoFecha.getFullYear(),
      informeDtoFecha.getMonth() + 1,
      0,
    );

    const titulacion = await this.titulacionRepository.findOne({
      where: { id: informe.titulacion.id },
    });

    const informeMes = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMes, ultimoDiaMes),
        titulacion,
      },
    });

    if (informeMes && informeMes.id !== informe.id) {
      throw new ConflictException('Ya existe un informe de este mes');
    }

    const fechaActual = new Date(request.fecha);

    const primerDiaMesAnterior = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() - 1, // Se resta uno para obtener el mes anterior
      1,
    );

    const ultimoDiaMesAnterior = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      0,
    );

    const primerDiaMesSiguiente = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      1,
    );

    const ultimoDiaMesSiguiente = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 2,
      0,
    );

    const informeMesAnterior = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMesAnterior, ultimoDiaMesAnterior),
        titulacion,
      },
    });

    const informeMesSiguiente = await this.informeRepository.findOne({
      where: {
        fecha: Between(primerDiaMesSiguiente, ultimoDiaMesSiguiente),
        titulacion,
      },
    });

    if (informeMesAnterior) {
      if (informeMesAnterior.porcentaje_avance >= request.porcentaje_avance) {
        throw new ConflictException(
          `El porcentaje de avance debe ser mayor al del mes anterior: ${informeMesAnterior.porcentaje_avance}%`,
        );
      }
    }

    if (informeMesSiguiente) {
      if (informeMesSiguiente.porcentaje_avance <= request.porcentaje_avance) {
        throw new ConflictException(
          `El porcentaje de avance debe ser menor al del mes siguiente: ${informeMesSiguiente.porcentaje_avance}%`,
        );
      }
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

    titulacion.avance_total = request.porcentaje_avance;
    await this.titulacionRepository.save(titulacion);

    informe.fecha = request.fecha;
    informe.porcentaje_avance = request.porcentaje_avance;
    informe.estado = request.estado;

    return await this.informeRepository.save(informe);
  }
}
