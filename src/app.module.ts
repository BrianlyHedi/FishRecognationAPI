import {
  Module
} from '@nestjs/common';
import {
  CommonModule
} from './common/common.module';
import {
  AuthModule
} from './auth/auth.module';
import {
  S3Service
} from './common/s3.service'; // sesuaikan path jika perlu
import {
  TransaksiModule
} from './transaksi/module/transaksi.module';
import {
  TangkapanModule
} from './transaksi/module/tangkapan.module';

@Module({
  imports: [
      CommonModule,
      TransaksiModule,
      TangkapanModule,
      AuthModule,
    ],
    controllers: [],
    providers: [S3Service],
      exports: [S3Service],
})
export class AppModule {}