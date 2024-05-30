import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante/estudiante.entity';
import { Persona } from './entities/persona.entity';
import { Informe } from './entities/informe.entity';
import { Actividad } from './entities/actividad.entity';
import { DocenteModule } from './docente/docente.module';
import { AuthModule } from './auth/auth.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { Docente } from './docente/docente.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.174.88.52',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'gestor-tutorias',
      entities: [Docente, Estudiante, Persona, Informe, Actividad],
      synchronize: false,
    }),
    DocenteModule,
    AuthModule,
    EstudianteModule,
  ],


})
export class AppModule { }



