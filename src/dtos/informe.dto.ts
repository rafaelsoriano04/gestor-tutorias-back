import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
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
  fecha_aprobacion: Date;
  fecha: string;

  @IsNotEmpty({ message: 'Sin estudiante' })
  @IsNumber()
  estudianteId: number;

  @IsNotEmpty({ message: 'Sin titulacion' })
  @IsNumber()
  titulacionId: number;
}
