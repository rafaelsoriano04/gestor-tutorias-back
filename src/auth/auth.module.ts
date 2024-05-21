import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DocenteService } from 'src/docente/docente.service';
import { DocenteModule } from 'src/docente/docente.module';

@Module({
  imports: [
    DocenteModule,
    JwtModule.register({
      secret: 'somoslosmejores',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
