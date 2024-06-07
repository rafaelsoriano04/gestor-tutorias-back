import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from 'src/entities/actividad.entity';
import { Informe } from 'src/entities/informe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad, Informe])],
  providers: [ActividadService],
  controllers: [ActividadController],
})
export class ActividadModule {}
