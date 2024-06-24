import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto, UpdateEstudianteDto } from './dto/estudiante.dto';
import { Estudiante } from './estudiante.entity';

@Controller('estudiante')
export class EstudianteController {
  constructor(private estudianteService: EstudianteService) {}

  @Get('/:id_docente')
  async getAllByDocente(
    @Param('id_docente') id_docente: number,
  ): Promise<Estudiante[]> {
    return await this.estudianteService.getAllByDocente(id_docente);
  }

  @Post()
  async save(@Body() newEstudiante: CreateEstudianteDto) {
    return await this.estudianteService.save(newEstudiante);
  }

  @Get('info/:id_estudiante')
  async getEstudianteById(@Param('id_estudiante') id_estudiante: number) {
    const estudiante =
      await this.estudianteService.getEstudianteById(id_estudiante);
    return estudiante;
  }

  @Put('/:id')
  async update(
    @Param('id') id_estudiante: number,
    @Body() request: UpdateEstudianteDto,
  ) {
    return await this.estudianteService.update(id_estudiante, request);
  }

  @Put('/:id/:estado')
  async updateEstado(
    @Param('id') id_estudiante: number,
    @Param('estado') estado: string,
  ) {
    return await this.estudianteService.updateEstado(id_estudiante, estado);
  }

  @Put('/:id/:estado')
  async updateAvanceTotal(
    @Param('id') id_estudiante: number,
    @Param('estado') estado: string,
  ) {
    return await this.estudianteService.updateEstado(id_estudiante, estado);
  }
}
