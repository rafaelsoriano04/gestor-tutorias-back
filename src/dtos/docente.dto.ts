import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, Length, MinLength, Matches, ValidateNested } from 'class-validator';
import { PersonaDto } from '../dtos/persona.dto';

export class DocenteDto {
    @IsNotEmpty()
    @IsString()
    nombre_usuario: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    contrasenia: string;

    @IsNotEmpty()
    @IsString()
    cargo: string;

    @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;
}
