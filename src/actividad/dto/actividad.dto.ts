import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ActividadDto {
  @IsNotEmpty({ message: 'Descripcion de la actividad requerida' })
  @IsString({ message: 'La descripcion debe ser una cadena' })
  descripcion: string;

  @IsNotEmpty({ message: 'Fecha de la actividad requerida' })
  @IsDate()
  @Type(() => Date)
  fecha_actividad: string;

  @IsNotEmpty({ message: 'Sin informe' })
  @IsNumber()
  id_informe: number;
}
