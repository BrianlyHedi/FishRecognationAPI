import {
    Injectable
} from '@nestjs/common';
import {
    TransaksiRepository
} from '../repository/transaksi.repository';
import {
    GetProduksiDto
} from '../dto/transaksi.dto';

@Injectable()
export class TransaksiService {
    constructor(private readonly repo: TransaksiRepository) {}

    async findAll(){
    const data = await this.repo.findAllWithIkan();
    const now = new Date();

    // Total seluruh data
    const totalBerat = data.reduce((sum, item) => sum + item.totalBeratKg, 0);

    // Daily
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const totalHariIni = data
        .filter(item => new Date(item.tanggal).toDateString() === today.toDateString())
        .reduce((sum, item) => sum + item.totalBeratKg, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const totalHariSebelumnya = data
        .filter(item => new Date(item.tanggal).toDateString() === yesterday.toDateString())
        .reduce((sum, item) => sum + item.totalBeratKg, 0);

    // Statistik per hari dalam 1 minggu (untuk chart)
    const hariMap = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const mingguan: Record < string, number > = {
        Sen: 0,
        Sel: 0,
        Rab: 0,
        Kam: 0,
        Jum: 0,
        Sab: 0,
        Min: 0,
    };
    data.forEach(item => {
        const hariStr = hariMap[new Date(item.tanggal).getDay()];
        if (mingguan[hariStr] !== undefined) mingguan[hariStr] += item.totalBeratKg;
    });

    // Monthly
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const bulanIni = data.filter(item => {
        const tanggal = new Date(item.tanggal);
        return tanggal.getMonth() === thisMonth && tanggal.getFullYear() === thisYear;
    }).reduce((sum, item) => sum + item.totalBeratKg, 0);

    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const bulanKemarin = data.filter(item => {
        const tanggal = new Date(item.tanggal);
        return tanggal.getMonth() === lastMonthDate.getMonth() &&
            tanggal.getFullYear() === lastMonthDate.getFullYear();
    }).reduce((sum, item) => sum + item.totalBeratKg, 0);

    // Statistik bulanan (Januari - Desember)
    const bulanan: Record < string, number > = {};
    for (let i = 0; i < 12; i++) {
        bulanan[i + 1] = 0;
    }
    data.forEach(item => {
        const bulan = new Date(item.tanggal).getMonth() + 1;
        bulanan[bulan] += item.totalBeratKg;
    });

    // Yearly
    const tahunIni = data.filter(item => {
        const tanggal = new Date(item.tanggal);
        return tanggal.getFullYear() === thisYear;
    }).reduce((sum, item) => sum + item.totalBeratKg, 0);

    const tahunLalu = data.filter(item => {
        const tanggal = new Date(item.tanggal);
        return tanggal.getFullYear() === thisYear - 1;
    }).reduce((sum, item) => sum + item.totalBeratKg, 0);

    // Statistik tahunan (misal 4 tahun terakhir)
    const tahunan: Record < string, number > = {};
    for (let i = thisYear - 3; i <= thisYear; i++) {
        tahunan[i] = 0;
    }
    data.forEach(item => {
        const tahun = new Date(item.tanggal).getFullYear();
        if (tahunan[tahun] !== undefined) tahunan[tahun] += item.totalBeratKg;
    });

    return {
        statistik: {
            hari: {
                total: totalBerat,
                hariSebelumnya: totalHariSebelumnya,
                baru: totalHariIni,
                mingguan,
            },
            bulan: {
                total: bulanIni,
                bulanSebelumnya: bulanKemarin,
                bulanan,
            },
            tahun: {
                total: tahunIni,
                tahunSebelumnya: tahunLalu,
                tahunan,
            }
        },
        produksiTerbaru: data.slice(0, 3),
        produksiList: data.map(row => ({
            id: row.id,
            userId: row.userId,
            ikanId: row.ikanId,
            tanggal: row.tanggal,
            totalBeratKg: row.totalBeratKg,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            ikanNama: row.ikan.nama,
        })),
    };
}
}