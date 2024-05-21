import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DocenteService } from 'src/docente/docente.service';
import { AuthPayloadDTO } from 'src/dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private docenteService: DocenteService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ nombre_usuario, contrasenia }: AuthPayloadDTO) {
    const findUser =
      await this.docenteService.findOneByUsername(nombre_usuario);

    if (!findUser) throw new UnauthorizedException('Credenciales invalidas');

    if (contrasenia === findUser.contrasenia) {
      const { contrasenia, ...user } = findUser;
      return this.jwtService.sign(user);
    }

    throw new UnauthorizedException('Credenciales invalidas');
  }
}
