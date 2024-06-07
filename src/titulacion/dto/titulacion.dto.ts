import { IsString, IsNotEmpty, IsDate, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class TitulacionDto {
  @IsNotEmpty({ message: 'Se necesita el tema del proyecto' })
  @Length(5, 100, { message: 'Tema incorrecto' })
  @IsString({ message: 'Dato no válido' })
  tema: string;

  @IsDate({ message: 'Fecha no válida' })
  @IsNotEmpty({ message: 'Ingrese la fecha de aprobación' })
  @Type(() => Date)
  fecha_aprobacion: Date;

  id_docente: number;
}
