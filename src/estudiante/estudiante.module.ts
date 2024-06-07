import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from 'src/persona/persona.entity';
import { Estudiante } from './estudiante.entity';
import { Docente } from 'src/docente/docente.entity';
import { DocenteModule } from 'src/docente/docente.module';
import { Titulacion } from 'src/titulacion/titulacion.entity';
import { TitulacionModule } from 'src/titulacion/titulacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Persona, Docente, Titulacion]),
    DocenteModule,
    TitulacionModule,
  ],
  providers: [EstudianteService],
  controllers: [EstudianteController],
})
export class EstudianteModule {}
