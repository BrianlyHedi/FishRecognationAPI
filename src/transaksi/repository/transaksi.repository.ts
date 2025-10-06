import {
    Injectable
} from '@nestjs/common';
import {
    PrismaService
} from '../../common/prisma.service';

@Injectable()
export class TransaksiRepository {
    constructor(private prisma: PrismaService) {}

    async findAllWithIkan(): Promise < any[] > {
        return this.prisma.produksi.findMany({
            include: {
                ikan: true
            },
            orderBy: {
                tanggal: 'desc'
            }
        });
    }
}