import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEstudianteDto } from './dto/estudiante.dto';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Docente } from 'src/docente/docente.entity';
import { Persona } from 'src/persona/persona.entity';
import { TitulacionService } from '../titulacion/titulacion.service';
import { Titulacion } from 'src/titulacion/titulacion.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Docente)
    private docenteRepository: Repository<Docente>,
    private titulacionService: TitulacionService,
  ) {}

  // Cuando se crea un estudiante, se crea la titulacion con el id del docentes
  async save(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const docente = await this.docenteRepository.findOneBy({
      id: createEstudianteDto.titulacion.id_docente,
    });

    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    const estudianteExists = await this.estudianteRepository.findOneBy({
      persona: {
        identificacion: createEstudianteDto.persona.identificacion,
      },
    });

    if (estudianteExists) {
      throw new ConflictException('El estudiante ya existe');
    }

    const titulacionExists = await this.estudianteRepository.findOneBy({
      titulacion: { tema: createEstudianteDto.titulacion.tema },
    });

    if (titulacionExists) {
      throw new ConflictException('El tema ya existe');
    }

    const estudiante = new Estudiante();
    estudiante.carrera = createEstudianteDto.carrera;
    estudiante.estado = 'En progreso';
    // Crear persona
    const persona = new Persona(); // Asumiendo que tienes un constructor que crea el objeto Persona
    persona.identificacion = createEstudianteDto.persona.identificacion;
    persona.nombre = createEstudianteDto.persona.nombre;
    persona.apellido = createEstudianteDto.persona.apellido;
    persona.telefono = createEstudianteDto.persona.telefono;
    persona.email = createEstudianteDto.persona.email;

    // Asignar persona a estudiante
    estudiante.persona = persona;

    // Se crea el estudiante
    const newEstudiante = await this.estudianteRepository.save(estudiante);

    // Crear titulacion con avance total 0
    const titulacion = new Titulacion();
    titulacion.avance_total = 0;
    titulacion.tema = createEstudianteDto.titulacion.tema;
    titulacion.docente = docente;
    titulacion.estudiante = newEstudiante;
    titulacion.fecha_aprobacion =
      createEstudianteDto.titulacion.fecha_aprobacion;

    await this.titulacionService.createTitulacion(titulacion);

    return newEstudiante;
  }

  async findOneByIdentificacion(
    identificacion: string,
  ): Promise<Estudiante | undefined> {
    return await this.estudianteRepository.findOne({
      where: { persona: { identificacion } },
      relations: ['persona'],
    });
  }

  async getAllByDocente(id_docente: number): Promise<any[]> {
    const docente = this.docenteRepository.findOne({
      where: { id: id_docente },
    });

    if (!docente) {
      throw new NotFoundException('Docente not found');
    }

    const estudiantes = this.estudianteRepository.find({
      relations: {
        titulacion: true,
        persona: true,
      },
      where: {
        titulacion: {
          docente: {
            id: id_docente,
          },
        },
      },
    });

    if (estudiantes) {
      return estudiantes;
    }

    throw new NotFoundException('El docente no tiene estudiantes asignados');
  }
}
