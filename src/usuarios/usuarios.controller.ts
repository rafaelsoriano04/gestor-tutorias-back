// src/usuarios/usuarios.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.services';
import { CreateUsuarioDto } from 'src/dtos/usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService: UsuariosService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUsuarioDto) {
        return this.usuariosService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() createUserDto: CreateUsuarioDto) {
        const token = await this.usuariosService.validateUser(createUserDto.usuario, createUserDto.clave);
        if (!token) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return { access_token: token };
    }
}


