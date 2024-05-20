import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.services';

@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService: UsuariosService) {}

    @Post('register')
    async register(@Body() userData: { identificacion: string; nombre: string; apellido: string; telefono: string; email: string; nombreUsuario: string; contrasena: string; cargo: string }) {
        const newUser = await this.usuariosService.registerUser(userData);
        return newUser;
    }
}
