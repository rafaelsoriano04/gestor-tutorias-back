import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocenteService } from './docente.service';
import { DocenteDto } from './dto/docente.dto';

@Controller('docente')
export class DocenteController {
  constructor(private docenteService: DocenteService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) =>
            `${error.property} has wrong value ${error.value}, ${error.constraints ? Object.values(error.constraints).join(', ') : 'Unknown error'}`,
        );
        return new BadRequestException(messages);
      },
    }),
  )
  async save(@Body() docenteDto: DocenteDto) {
    return this.docenteService.save(docenteDto);
  }

  @Get(':id')
  async getDocenteById(@Param('id') id: number) {
    const docente = await this.docenteService.findOneByIdWithPersona(id);
    if (!docente) {
      throw new NotFoundException('Docente not found');
    }
    return docente;
  }
}
