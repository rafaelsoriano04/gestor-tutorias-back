// src/docentes/dto/docente.dto.ts
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonaDto } from './persona.dto';

export class DocenteDto {
    @IsString()
    cargo: string;

    @ValidateNested()
    @Type(() => PersonaDto)
    persona: PersonaDto;
}
