import { UserModule } from '../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { SliderRepository } from '../core/repositories';

@Module({
    imports: [TypeOrmModule.forFeature([SliderRepository]), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
    controllers: [SliderController],
    providers: [SliderService],
    exports: [TypeOrmModule],
})
export class SliderModule {}