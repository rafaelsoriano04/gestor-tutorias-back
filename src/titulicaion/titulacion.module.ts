import { Module } from '@nestjs/common';
import { TitulicaionService } from './titulacion.service';
import { TitulicaionController } from './titulacion.controller';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Docente } from 'src/docente/docente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titulacion } from 'src/entities/titulacion.entity';
import { Informe } from 'src/entities/informe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Docente, Titulacion, Informe]),
  ],
  providers: [TitulicaionService],
  controllers: [TitulicaionController],
})
export class TitulicaionModule {}
