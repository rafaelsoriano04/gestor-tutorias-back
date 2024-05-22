import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DocenteModule } from 'src/docente/docente.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalGuard } from './guards/local.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'somoslosmejores',
      signOptions: { expiresIn: '1d' },
    }),
    DocenteModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalGuard, JwtStrategy],
})
export class AuthModule {}
