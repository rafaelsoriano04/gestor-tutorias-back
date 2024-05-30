import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsDate, IsNumber, IsEmpty } from 'class-validator';
import { PersonaDto } from '../dtos/persona.dto';

export class EstudianteDto {
  @IsNotEmpty()
  @IsDate()
  fecha_aprobacion: Date;

  @IsNotEmpty()
  @IsString()
  carrera: string;

  @IsNotEmpty()
  @IsString()
  tema: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsEmpty()
  @IsNumber()
  porcentaje: number;
  
  @IsNotEmpty()
  @IsNumber()
  id_docente: number;


  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;

}