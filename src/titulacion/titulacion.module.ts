import { Module } from '@nestjs/common';
import { TitulacionService } from './titulacion.service';
import { TitulacionController } from './titulacion.controller';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Docente } from 'src/docente/docente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titulacion } from 'src/titulacion/titulacion.entity';
import { Informe } from '../informe/informe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Docente, Titulacion, Informe]),
  ],
  providers: [TitulacionService],
  controllers: [TitulacionController],
  exports: [TitulacionService],
})
export class TitulacionModule {}
