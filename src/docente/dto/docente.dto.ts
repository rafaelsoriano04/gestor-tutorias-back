import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PersonaDto } from '../../persona/dto/persona.dto';

export class DocenteDto {
  @IsNotEmpty()
  @IsString()
  nombre_usuario: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  contrasenia: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;
}
