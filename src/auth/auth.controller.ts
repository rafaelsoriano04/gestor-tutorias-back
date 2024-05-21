import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthPayloadDTO } from 'src/dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authPayload: AuthPayloadDTO) {
    return this.authService.validateUser(authPayload);
  }
}
