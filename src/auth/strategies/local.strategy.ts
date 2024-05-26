import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nombre_usuario',
      passwordField: 'contrasenia',
    });
  }

  async validate(nombre_usuario: string, contrasenia: string): Promise<any> {
    const user = await this.authService.validateUser({
      nombre_usuario,
      contrasenia,
    });
    if (!user) throw new UnauthorizedException('No');
    return user;
  }
}
