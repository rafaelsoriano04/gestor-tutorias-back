import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TitulicaionService } from './titulacion.service';
import { TitulacionDto } from 'src/dtos/titulacion.dto';

@Controller('titulacion')
export class TitulicaionController {
  constructor(private titulacionService: TitulicaionService) {}

  @Get()
  async getAllTemas() {
    return this.titulacionService.getAll();
  }

  @Get(':id')
  async getOneTema(@Param('id_estudiante') id_estudiante: number) {
    return this.titulacionService.getByEstudiante(id_estudiante);
  }

  @Post()
  async createTema(@Body() createTemaDto: TitulacionDto) {
    const newTema =
      await this.titulacionService.createTitulacion(createTemaDto);
    return { message: 'Tema de titulación creado exitosamente', newTema };
  }
}
