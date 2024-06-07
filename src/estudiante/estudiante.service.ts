import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EstudianteDto } from "src/dtos/estudiante.dto";
import { Repository } from "typeorm";
import { Estudiante } from "./estudiante.entity";
import { Docente } from "src/docente/docente.entity";
import { Persona } from "src/entities/persona.entity";

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Docente)
    private docenteRepository: Repository<Docente>
  ) { }

  async save(estudianteDto: EstudianteDto): Promise<Estudiante> {
    const docente = await this.docenteRepository.findOneBy({ id: estudianteDto.id_docente })
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    const estudiante = new Estudiante();
    // Mapear propiedades
    estudiante.fecha_aprobacion = estudianteDto.fecha_aprobacion;
    estudiante.carrera = estudianteDto.carrera;
    estudiante.tema = estudianteDto.tema;
    estudiante.estado = estudianteDto.estado;
    estudiante.porcentaje = 0;
    estudiante.docente = docente;
    // Suponiendo que persona ya viene mapeada y validada
    const persona = new Persona();  // Asumiendo que tienes un constructor que crea el objeto Persona
    persona.identificacion = estudianteDto.persona.identificacion;
    persona.nombre = estudianteDto.persona.nombre;
    persona.apellido = estudianteDto.persona.apellido;
    persona.email = estudianteDto.persona.email;
    persona.telefono = estudianteDto.persona.telefono;

    estudiante.persona = persona;

    return await this.estudianteRepository.save(estudiante);
  }

  async findOneByIdentificacion(identificacion: string): Promise<Estudiante | undefined> {
    return await this.estudianteRepository.findOne({
      where: { persona: { identificacion } },
      relations: ['persona'],
    });
  }

  async getAllByDocente(id_docente: number): Promise<any[]> {
    try {
      // Obtiene los estudiantes que están asociados con un docente específico.
      const estudiantes = await this.estudianteRepository.find({
        where: { docente: { id: id_docente } },
        relations: ['persona', 'docente'] // Asegúrate de cargar también la relación con 'docente' si es necesario para otros usos
      });
  
      // Mapea los resultados para ajustar la salida al formato deseado.
      return estudiantes.map(estudiante => ({
        id: estudiante.id,
        nombre: estudiante.persona.nombre + ' ' + estudiante.persona.apellido,
        cedula: estudiante.persona.identificacion,
        carrera: estudiante.carrera,
        estado: estudiante.estado,
        fechaAprobacion: estudiante.fecha_aprobacion,
        porcentaje: estudiante.porcentaje,
      }));
    } catch (error) {
      // Maneja cualquier error que ocurra durante la consulta.
      throw new NotFoundException('Error al obtener los estudiantes por docente: ' + error.message);
    }
  }
  
}
