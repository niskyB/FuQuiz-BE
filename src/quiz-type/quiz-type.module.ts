import { QuizTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizTypeController } from './quiz-type.controller';
import { QuizTypeService } from './quiz-type.service';
import { QuizType } from '../core/models';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([QuizType])],
    controllers: [QuizTypeController],
    providers: [QuizTypeService, { provide: QuizTypeRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizTypeRepository), inject: [Connection] }],
    exports: [QuizTypeService],
})
export class QuizTypeModule {}
