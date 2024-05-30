import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from 'src/dtos/estudiante.dto';
import { Estudiante } from './estudiante.entity';

@Controller('estudiante')
export class EstudianteController {
    constructor(private estudianteService: EstudianteService) {}

    @Get('/:id_docente')
    async getAllByDocente(@Param('id_docente') id_docente: number): Promise<Estudiante[]> {
        return await this.estudianteService.getAllByDocente(id_docente);
    }

    @Post()
    async save (@Body() estudiante: EstudianteDto){
        return await this.estudianteService.save(estudiante);
    }
    
}
