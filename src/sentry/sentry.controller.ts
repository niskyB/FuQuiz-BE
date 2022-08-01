import { Controller, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('sentry')
@ApiBearerAuth()
@Controller('sentry')
export class SentryController {
    @Get('/')
    async cGetSentry(@Res() res: Response) {
        return res.send();
    }
}
