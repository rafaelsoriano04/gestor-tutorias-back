import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante/estudiante.entity';
import { Persona } from './persona/persona.entity';
import { Informe } from './informe/informe.entity';
import { Actividad } from './actividad/actividad.entity';
import { DocenteModule } from './docente/docente.module';
import { AuthModule } from './auth/auth.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { Docente } from './docente/docente.entity';
import { TitulacionModule } from './titulacion/titulacion.module';
import { Titulacion } from './titulacion/titulacion.entity';
import { InformeModule } from './informe/informe.module';
import { ActividadModule } from './actividad/actividad.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.174.88.52',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'gestor-tutorias',
      entities: [Docente, Estudiante, Persona, Informe, Actividad, Titulacion],
      synchronize: false,
    }),
    DocenteModule,
    AuthModule,
    EstudianteModule,
    TitulacionModule,
    InformeModule,
    ActividadModule,
  ],
})
export class AppModule {}
