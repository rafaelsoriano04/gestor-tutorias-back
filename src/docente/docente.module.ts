import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocenteController } from './docente.controller';
import { DocenteService } from './docente.service';
import { Persona } from 'src/entities/persona.entity';
import { Docente } from 'src/entities/docente.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Persona, Docente])
    ],
    controllers: [DocenteController],
    providers: [DocenteService]
})
export class DocenteModule { }
