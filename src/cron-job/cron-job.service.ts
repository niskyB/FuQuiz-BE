import { EmailService } from './../core/providers/email/email.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegistrationStatus } from '../core/models';
import { RegistrationService } from '../registration/registration.service';

@Injectable()
export class CronJobService {
    constructor(private readonly registrationService: RegistrationService, private readonly emailService: EmailService) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    async cCheckValidRegistration() {
        const today = new Date().toISOString();
        const registrations = await this.registrationService.getPaidRegistrationByDay(today);

        Promise.all(
            registrations.map(async (item) => {
                item.status = RegistrationStatus.INACTIVE;
                await this.registrationService.saveRegistration(item);
                await this.emailService.sendInactiveSubject(item.customer.user.email, item.customer.user.fullName, item.pricePackage.subject.name);
            }),
        );
    }
}
