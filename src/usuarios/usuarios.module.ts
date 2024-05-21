// src/usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.services';
import { Usuario } from 'src/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey',  // Usa una clave secreta compleja y almacénala de forma segura
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService, JwtModule],
})
export class UsuariosModule {}
