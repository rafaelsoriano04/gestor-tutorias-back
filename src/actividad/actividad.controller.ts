import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './dto/actividad.dto';
import { Actividad } from './actividad.entity';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.actividadService.findById(id);
  }

  @Get('informe/:informeId')
  async findByInformeId(@Param('informeId') informeId: number) {
    return await this.actividadService.findByInformeId(informeId);
  }

  @Post()
  async create(@Body() actividadDto: ActividadDto) {
    return await this.actividadService.createActividad(actividadDto);
  }

  @Delete()
  async eliminarActividades(@Body() actividades: Actividad[]): Promise<void> {
    await this.actividadService.eliminarActividades(actividades);
  }
}
