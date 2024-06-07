import { Controller, Get, Param } from '@nestjs/common';
import { TitulacionService } from './titulacion.service';

@Controller('titulacion')
export class TitulacionController {
  constructor(private titulacionService: TitulacionService) {}

  @Get()
  async getAllTemas() {
    return this.titulacionService.getAll();
  }

  @Get(':id')
  async getOneTema(@Param('id_estudiante') id_estudiante: number) {
    return this.titulacionService.getByEstudiante(id_estudiante);
  }
}
