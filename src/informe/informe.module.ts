import { Module } from '@nestjs/common';
import { InformeService } from './informe.service';
import { InformeController } from './informe.controller';
import { Informe } from '../informe/informe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Titulacion } from 'src/titulacion/titulacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Informe, Estudiante, Titulacion])],
  providers: [InformeService],
  controllers: [InformeController],
})
export class InformeModule {}
