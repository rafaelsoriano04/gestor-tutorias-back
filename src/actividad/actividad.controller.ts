import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './dto/actividad.dto';
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
}
