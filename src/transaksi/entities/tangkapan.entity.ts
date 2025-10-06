export class Tangkapan {
    id: number;
    userId: number;
    kapalId: number;
    pelabuhanId: number;
    tanggalPenangkapan: Date;
    waktuPenangkapan: Date;
    lokasiLat ? : number;
    lokasiLng ? : number;
    catatan ? : string;
    createdAt: Date;
    updatedAt: Date;
    details ? : TangkapanDetail[];
}

export class TangkapanDetail {
    id: number;
    tangkapanId: number;
    ikanId: number;
    qrId ? : bigint;
    totalBeratKg: number;
    kondisiIkanId: number;
    tanggalMasukColdstorage ? : Date;
    coldStorageId ? : number;
    posisiPenyimpananColdstorage ? : string;
    keterangan ? : string;
    createdAt: Date;
    updatedAt: Date;
    ikan ? : M_Ikan;
    qr ? : TangkapanQR;
}

export class M_Ikan {
    id: number;
    nama: string;
    gambarUrl ? : string;
    keterangan ? : string;
}

export class TangkapanQR {
    id_qr: bigint;
    original_name: string;
    s3_key: string;
    mime_type: string;
    file_size: number;
    created_at: Date;
    updated_at: Date;
}