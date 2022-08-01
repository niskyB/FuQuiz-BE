import { EmailModule } from './../core/providers/email/email.module';
import { RegistrationModule } from './../registration/registration.module';
import { Module } from '@nestjs/common';
import { CronJobController } from './cron-job.controller';
import { CronJobService } from './cron-job.service';

@Module({
    imports: [RegistrationModule, EmailModule],
    controllers: [CronJobController],
    providers: [CronJobService],
})
export class CronJobModule {}
