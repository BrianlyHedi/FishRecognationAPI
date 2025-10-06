import {
    Controller,
    Get,
    UseGuards
} from '@nestjs/common';
import {
    TransaksiService
} from '../service/transaksi.service';
import {
    GetProduksiDto
} from '../dto/transaksi.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('produksi')
export class TransaksiController {
    constructor(private readonly service: TransaksiService) {}

    @Get()
    async getAll() {
        return this.service.findAll();
    }
}

