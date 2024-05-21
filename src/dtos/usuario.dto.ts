// src/usuarios/dto/create-usuario.dto.ts
import { IsString, IsNotEmpty, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { DocenteDto } from './docente.dto';

export class CreateUsuarioDto {
    @IsString()
    usuario: string;

    @IsString()
    @MinLength(8)
    clave: string;

    @ValidateNested()
    @Type(() => DocenteDto)
    docente: DocenteDto;
}
