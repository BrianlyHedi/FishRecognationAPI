import {
    Injectable
} from '@nestjs/common';
import {
    TangkapanRepository
} from '../repository/tangkapan.repository';
import {
    CreateTangkapanDto
} from '../dto/tangkapan.dto';
import * as QRCode from 'qrcode';
import {
    S3Service
} from '../../common/s3.service';

@Injectable()
export class TangkapanService {
    constructor(
        private repo: TangkapanRepository,
        private s3Service: S3Service
    ) {}

    async create(dto: CreateTangkapanDto, userId: string) {
        const detailsData = await Promise.all(dto.details.map(async det => {
            const ikan = await this.repo.createIkanIfNotExist(det.ikanNama, det.ikanGambarUrl);
            return {
                ikanId: ikan.id,
                totalBeratKg: det.totalBeratKg,
                kondisiIkanId: det.kondisiIkanId,
                coldStorageId: det.coldStorageId,
                posisiPenyimpananColdstorage: det.posisiPenyimpananColdstorage,
                tanggalMasukColdstorage: det.tanggalMasukColdstorage,
                keterangan: det.keterangan,
            };
        }));

        const tangkapan = await this.repo.createTangkapan({
            userId,
            kapalId: dto.kapalId,
            pelabuhanId: dto.pelabuhanId,
            tanggalPenangkapan: dto.tanggalPenangkapan,
            waktuPenangkapan: dto.waktuPenangkapan,
            lokasiLat: dto.lokasiLat,
            lokasiLng: dto.lokasiLng,
            catatan: dto.catatan,
            tangkapanDetails: {
                create: detailsData
            }
        });

        for (const detail of tangkapan.tangkapanDetails) {
            const qrContent = `https://example.com/qr/${detail.id}`;
            const qrBuffer = await QRCode.toBuffer(qrContent);

            const s3Key = await this.s3Service.uploadBuffer(qrBuffer, `qr_${detail.id}.png`, 'image/png');

            const qrRecord = await this.repo.createQR({
                original_name: `qr_${detail.id}.png`,
                s3_key: s3Key,
                mime_type: 'image/png',
                file_size: qrBuffer.length,
            });

            await this.repo.updateDetailQr(detail.id, qrRecord.id_qr);
        }

        return tangkapan;
    }

    async findAll() {
        return await this.repo.findAll();
    }
}