import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
    NotFoundException,
    Param,
    BadRequestException
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
    @Get(':id')
    async getById(@Param('id') id: string) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            throw new BadRequestException('Invalid ID parameter');
        }
        const result = await this.service.findById(parsedId);
        if (!result) {
            throw new NotFoundException(`Data with ID ${parsedId} not found`);
        }
        return result;
    }
}