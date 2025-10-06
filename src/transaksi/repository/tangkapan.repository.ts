import {
    Injectable
} from '@nestjs/common';
import {
    PrismaService
} from '../../common/prisma.service';

@Injectable()
export class TangkapanRepository {
    constructor(private prisma: PrismaService) {}

    async createTangkapan(data: any) {
    return this.prisma.tangkapan.create({
        data,
        include: {
            tangkapanDetails: true // Sertakan relasi tangkapanDetails dalam hasil
        }
    });
}
    async findAll() {
        
    return this.prisma.tangkapan.findMany({
        include: {
            tangkapanDetails: {
                include: {
                    ikan: true,
                    tangkapanQr: true,
                    kondisiIkan: true
                },
            },
            kapal: true,
            pelabuhan: true,
        },
    });
    }

   async findById(id: number) {
       return await this.prisma.tangkapan.findUnique({
           where: {
               id
           },
           include: {
               tangkapanDetails: {
                   include: {
                       ikan: true,
                       tangkapanQr: true,
                       kondisiIkan: true,
                   },
               },
               kapal: true,
               pelabuhan: true,
           },
       });
   }
    async createIkanIfNotExist(nama: string, gambarUrl ? : string) {
        let ikan = await this.prisma.m_Ikan.findUnique({
            where: {
                nama
            }
        });
        if (!ikan) {
            ikan = await this.prisma.m_Ikan.create({
                data: {
                    nama,
                    gambarUrl
                }
            });
        }
        return ikan;
    }

    async createDetail(data: any) {
        return this.prisma.tangkapanDetail.create({
            data
        });
    }

    async updateDetailQr(detailId: number, qrId: bigint) {
        console.log(detailId)
        return this.prisma.tangkapanDetail.update({
            where: {
                id: detailId
            },
            data: {
                qrId
            }
        });
    }

    async createQR(data: any) {
        console.log(data)
        return this.prisma.tangkapanQR.create({
            data
        });
    }
}