// src/usuarios/usuarios.services.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/entities/usuario.entity';
import { CreateUserDto } from '../dtos/usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario) private usuariosRepository: Repository<Usuario>,
        private jwtService: JwtService
    ) {}

    async register(usuarioData: CreateUserDto): Promise<Usuario> {
        const hashedPassword = await bcrypt.hash(usuarioData.clave, 10);
        const newUser = this.usuariosRepository.create({
            nombreUsuario: usuarioData.usuario,
            contrasena: hashedPassword,
        });
        return this.usuariosRepository.save(newUser);
    }

    async validateUser(nombreUsuario: string, pass: string): Promise<string | null> {
        const user = await this.usuariosRepository.findOne({ where: { nombreUsuario } });
        if (user && await bcrypt.compare(pass, user.contrasena)) {
            const payload = { username: user.nombreUsuario, sub: user.id };
            return this.jwtService.sign(payload);
        }
        return null;
    }
}

