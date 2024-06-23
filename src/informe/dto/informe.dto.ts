import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Actividad } from 'src/actividad/actividad.entity';
export class InformeDto {
  @IsNotEmpty({ message: 'Ingrese el anexo del informe' })
  @IsString({ message: 'Debe ser tipo cadena' })
  anexo: string;

  @IsNotEmpty({ message: 'Ingrese el porcentaje del informe' })
  @IsNumber()
  porcentaje_avance: number;

  @IsDate({ message: 'Fecha incorrecta' })
  @IsNotEmpty({ message: 'Ingrese el anexo del informe' })
  @Type(() => Date)
  fecha: Date;

  @IsNotEmpty({ message: 'Sin estudiante' })
  @IsNumber()
  id_estudiante: number;

  @IsNotEmpty({ message: 'Sin titulacion' })
  @IsNumber()
  id_titulacion: number;

  @IsNotEmpty({ message: 'Sin titulacion' })
  @IsString()
  estado: string;

  actividades: Actividad[];
}
