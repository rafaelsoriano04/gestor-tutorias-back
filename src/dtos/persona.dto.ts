// src/personas/dto/persona.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class PersonaDto {
    @IsString()
    identificacion: string;

    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsString()
    telefono: string;

    @IsString()
    email: string;
}
