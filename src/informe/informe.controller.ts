import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { InformeService } from './informe.service';
import { InformeDto } from './dto/informe.dto';
import { Informe } from './informe.entity';

@Controller('informes')
export class InformeController {
  constructor(private readonly informeService: InformeService) {}

  @Get('estudiante/:id')
  async findByEstudianteId(@Param('id') id: number) {
    return this.informeService.findByEstudianteId(id);
  }

  @Get('titulacion/:tema')
  async findByTitulacionTema(@Param('tema') tema: string) {
    return this.informeService.findByTitulacionTema(tema);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.informeService.findById(id);
  }

  @Post()
  async create(@Body() createInforme: InformeDto) {
    return this.informeService.createInforme(createInforme);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.informeService.deleteInforme(id);
  }

  @Put()
  async update(@Body() request: Informe) {
    return this.informeService.update(request);
  }
}
