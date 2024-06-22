import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEstudianteDto, UpdateEstudianteDto } from './dto/estudiante.dto';
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
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
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

    const personaExists = await this.personaRepository.findOneBy({
      identificacion: createEstudianteDto.persona.identificacion,
    });

    if (personaExists) {
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
    estudiante.estado = 'En proceso';
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

  async update(id_estudiante: number, request: UpdateEstudianteDto) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: id_estudiante },
      relations: {
        titulacion: true,
        persona: true,
      },
    });

    console.log(estudiante);

    if (request.nombre) {
      estudiante.persona.nombre = request.nombre;
    }

    if (request.apellido) {
      estudiante.persona.apellido = request.apellido;
    }

    if (request.carrera) {
      estudiante.carrera = request.carrera;
    }

    if (request.tema) {
      estudiante.titulacion.tema = request.tema;
    }

    if (request.fecha_aprobacion) {
      estudiante.titulacion.fecha_aprobacion = request.fecha_aprobacion;
    }

    return await this.estudianteRepository.save(estudiante);
  }

  async getEstudianteById(
    id_estudiante: number,
  ): Promise<Estudiante | undefined> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: id_estudiante },
      relations: ['persona', 'titulacion'],
    });

    return estudiante;
  }

  async updateEstado(id_estudiante: number, estado: string) {
    const estudiante = await this.estudianteRepository.findOneBy({
      id: id_estudiante,
    });

    estudiante.estado = estado;

    await this.estudianteRepository.save(estudiante);
  }
}
