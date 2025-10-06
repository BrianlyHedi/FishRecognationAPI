import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req
} from '@nestjs/common';
import {
    TangkapanService
} from '../service/tangkapan.service';
import {
    CreateTangkapanDto,
    CreateTangkapanQrDto
} from '../dto/tangkapan.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
    Request
} from 'express';

declare module 'express' {
    interface Request {
        user ? : any;
    }
}

@UseGuards(AuthGuard)
@Controller('tangkapan')
export class TangkapanController {
    constructor(private service: TangkapanService) {}

    @Post()
    async create(@Body() dto: CreateTangkapanDto, @Req() req: Request) {
        const userId = req.user.sub;
        return this.service.create(dto, userId);
    }

    @Get()
    async findAll() {
        return this.service.findAll();
    }
}