import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthService } from '../services/health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @ApiOperation({ summary: 'Verifica saúde de todos os microserviços' })
    @ApiResponse({ status: 200, description: 'Todos os serviços ok' })
    @ApiResponse({ status: 503, description: 'Um ou mais serviços fora do ar' })
    @Get()
    async health(@Res() res: Response) {
        const result = await this.healthService.checkAll();

        if (result.status === 'ok') {
            return res.status(200).json(result);
        }

        return res.status(503).json(result);
    }
}
