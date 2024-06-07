import { Module } from '@nestjs/common';
import { InformeService } from './informe.service';
import { InformeController } from './informe.controller';
import { Informe } from 'src/entities/informe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Informe])],
  providers: [InformeService],
  controllers: [InformeController],
})
export class InformeModule {}
