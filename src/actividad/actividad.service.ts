import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from './actividad.entity';
import { ActividadDto } from './dto/actividad.dto';
import { Informe } from '../informe/informe.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,

    @InjectRepository(Informe)
    private informeRepository: Repository<Informe>,
  ) {}

  async findById(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { id } });
    if (!actividad) {
      throw new NotFoundException(`Actividad with ID ${id} not found`);
    }
    return actividad;
  }

  async findByInformeId(informeId: number): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      where: { informe: { id: informeId } },
      order: { fecha_actividad: 'ASC' }, // Asegúrate de especificar el orden de manera correcta
    });
  }

  // Crear actividad
  async createActividad(ActividadDto: ActividadDto): Promise<Actividad> {
    const informe = await this.informeRepository.findOne({
      where: { id: ActividadDto.id_informe },
    });
    if (!informe) {
      throw new NotFoundException(`Id de informe incorrecta`);
    }

    const actividad = this.actividadRepository.create({
      ...ActividadDto,
      informe,
    });

    return await this.actividadRepository.save(actividad);
  }

  async eliminarActividades(actividades: Actividad[]): Promise<void> {
    actividades.map(async (actividad) => {
      await this.actividadRepository.remove(actividad);
    });
  }

  async findActivitiesByStudentId(studentId: number): Promise<Actividad[]> {
    return await this.actividadRepository
      .createQueryBuilder('actividad')
      .leftJoinAndSelect('actividad.informe', 'informe')
      .leftJoinAndSelect('informe.titulacion', 'titulacion')
      .leftJoinAndSelect('titulacion.estudiante', 'estudiante')
      .where('estudiante.id = :studentId', { studentId })
      .getMany();
  }
}
