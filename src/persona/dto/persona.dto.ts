// src/personas/dto/persona.dto.ts
import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class PersonaDto {
  @IsNotEmpty({ message: 'La identificación es requerida.' })
  @Length(10, 10, {
    message:
      'El número de identificación debe tener exactamente 10 caracteres.',
  })
  identificacion: string;

  @IsNotEmpty({ message: 'El nombre es requerido.' })
  @IsString({ message: 'El nombre debe ser una cadena.' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es requerido.' })
  @IsString({ message: 'El apellido debe ser una cadena.' })
  apellido: string;

  @IsNotEmpty({ message: 'El teléfono es requerido.' })
  @IsString({ message: 'El teléfono debe ser una cadena.' })
  telefono: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email: string;
}
