import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Docente } from './entities/docente.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Persona } from './entities/persona.entity';
import { Informe } from './entities/informe.entity';
import { Actividad } from './entities/actividad.entity';
import { UsuariosModule } from './usuarios/usuarios.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.174.88.52',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'gestor-tutorias',  
      entities: [Usuario,Docente,Estudiante,Persona,Informe, Actividad],          
      synchronize: true,            
    }),
    UsuariosModule,

    
    
  ],


})
export class AppModule {}



