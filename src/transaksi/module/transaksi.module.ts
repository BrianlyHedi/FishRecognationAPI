import {
    Module
} from '@nestjs/common';

import {
    // PrismaMasterService,
    PrismaService
} from 'src/common/prisma.service';
import { TransaksiController } from '../controller/transaksi.controller';
import { TransaksiRepository } from '../repository/transaksi.repository';
import { TransaksiService } from '../service/transaksi.service';

@Module({
    imports: [TransaksiModule],
    controllers: [TransaksiController],
    providers: [TransaksiService, TransaksiRepository, PrismaService],
})
export class TransaksiModule {}