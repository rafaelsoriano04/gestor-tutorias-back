import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDto } from 'src/dtos/actividad.dto';
@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.actividadService.findById(id);
  }

  @Get('informe/:informeId')
  findByInformeId(@Param('informeId') informeId: number) {
    return this.actividadService.findByInformeId(informeId);
  }

  @Post()
  create(@Body() ActividadDto: ActividadDto) {
    const actividad = this.actividadService.createActividad(ActividadDto);
    return { message: 'La actividad se creó con exito', actividad };
  }
}
