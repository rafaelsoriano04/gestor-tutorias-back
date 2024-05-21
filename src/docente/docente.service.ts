import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Docente } from 'src/entities/docente.entity';
import { Persona } from 'src/entities/persona.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocenteService {
    constructor(
        @InjectRepository(Docente) private docentesRepository: Repository<Docente>
    ) { }

    async save(docente: any): Promise<Docente> {
        
        if (docente != null) {
            if (docente.persona.identificacion.length == 10) {
                await docente.setPassword(docente.contrasenia);
                return await this.docentesRepository.save(docente);
            }
            throw new BadRequestException('El numero de identificacion no es valido');
        }

        throw new BadRequestException('Datos faltantes');
    }
}
