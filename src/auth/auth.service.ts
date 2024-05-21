import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DocenteService } from 'src/docente/docente.service';
import { AuthPayloadDTO } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private docenteService: DocenteService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ nombre_usuario, contrasenia }: AuthPayloadDTO) {
    const findUser = await this.docenteService.findOneByUsername(nombre_usuario);

    if (!findUser) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    // Utiliza bcrypt.compare para verificar la contraseña
    const isMatch = await bcrypt.compare(contrasenia, findUser.contrasenia);
    if (isMatch) {
      const { contrasenia, persona, cargo, ...userDetails } = findUser;
      return this.jwtService.sign(userDetails); // Firmar y retornar el JWT
    }

    throw new UnauthorizedException('Credenciales invalidas');
  }

}
