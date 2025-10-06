export class CreateTangkapanDto {
    userId?: number;
    kapalId: number;
    pelabuhanId: number;
    tanggalPenangkapan: Date;
    waktuPenangkapan: Date;
    lokasiLat ? : number;
    lokasiLng ? : number;
    catatan ? : string;
    details: CreateTangkapanDetailDto[];
}

export class CreateTangkapanDetailDto {
    ikanNama: string; // Untuk create ikan sekaligus jika belum ada
    ikanGambarUrl ? : string;
    totalBeratKg: number;
    kondisiIkanId: number;
    coldStorageId ? : number;
    posisiPenyimpananColdstorage ? : string;
    tanggalMasukColdstorage ? : Date;
    keterangan ? : string;
}

export class CreateTangkapanQrDto {
    original_name: string;
    s3_key: string;
    mime_type: string;
    file_size: number;
    tangkapanDetailId: number;
}