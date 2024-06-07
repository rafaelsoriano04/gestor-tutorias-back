import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InformeService } from './informe.service';
import { InformeDto } from 'src/dtos/informe.dto';

@Controller('informes')
export class InformeController {
  constructor(private readonly informeService: InformeService) {}

  @Get('estudiante/:id')
  findByEstudianteId(@Param('id') id: number) {
    return this.informeService.findByEstudianteId(id);
  }

  @Get('titulacion/:tema')
  findByTitulacionTema(@Param('tema') tema: string) {
    return this.informeService.findByTitulacionTema(tema);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.informeService.findById(id);
  }

  @Post()
  create(@Body() InformeDto: InformeDto) {
    const newInforme = this.informeService.createInforme(InformeDto);
    return { message: 'Informe creado exitosamente', newInforme };
  }
}
