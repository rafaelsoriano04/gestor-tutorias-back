import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { Docente } from 'src/entities/docente.entity';
import { Persona } from 'src/entities/persona.entity';
import { Usuario } from 'src/entities/usuario.entity';
import { UsuariosService } from './usuarios.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Persona, Docente])
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService]
})
export class UsuariosModule {}
