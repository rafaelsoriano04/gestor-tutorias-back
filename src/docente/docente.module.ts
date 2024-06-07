import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocenteController } from './docente.controller';
import { DocenteService } from './docente.service';
import { Persona } from 'src/persona/persona.entity';
import { Titulacion } from 'src/titulacion/titulacion.entity';
import { Docente } from './docente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, Docente, Titulacion])],
  controllers: [DocenteController],
  providers: [DocenteService],
  exports: [DocenteService],
})
export class DocenteModule {}
