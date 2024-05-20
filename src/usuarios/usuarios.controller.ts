import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.services';

@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService: UsuariosService) {}

    @Post('register')
    async register(@Body() usuarioData: any) {
        return this.usuariosService.saveUsuario(usuarioData);
    }

}
