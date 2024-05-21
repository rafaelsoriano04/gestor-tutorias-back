import { Body, Controller, Post } from '@nestjs/common';
import { DocenteService } from './docente.service';

@Controller('docente')
export class DocenteController {
    constructor(private docenteService: DocenteService) {}

    @Post()
    async save(@Body() docente: any) {
        return this.docenteService.save(docente);
    }
}
