import { TitulacionDto } from 'src/titulacion/dto/titulacion.dto';
import { PersonaDto } from '../../persona/dto/persona.dto';

export class CreateEstudianteDto {
  carrera: string;
  persona: PersonaDto;
  titulacion: TitulacionDto;
}
