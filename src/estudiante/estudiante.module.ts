import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from 'src/entities/persona.entity';
import { Estudiante } from './estudiante.entity';
import { Docente } from 'src/docente/docente.entity';
import { DocenteModule } from 'src/docente/docente.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Persona, Docente]), 
    DocenteModule 
  ],
  providers: [EstudianteService],
  controllers: [EstudianteController],
})
export class EstudianteModule {}
