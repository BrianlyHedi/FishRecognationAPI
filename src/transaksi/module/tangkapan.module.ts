import {
    Module
} from '@nestjs/common';
import {
    TangkapanController
} from '../controller/tangkapan.controller';
import {
    TangkapanService
} from '../service/tangkapan.service';

import {
    PrismaService
} from '../../common/prisma.service';
import { TangkapanRepository } from '../repository/tangkapan.repository';

@Module({
    controllers: [TangkapanController],
    providers: [TangkapanService, TangkapanRepository, PrismaService],
})
export class TangkapanModule {}