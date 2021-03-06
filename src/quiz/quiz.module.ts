import { RegistrationModule } from './../registration/registration.module';
import { DimensionModule } from './../dimension/dimension.module';
import { LessonModule } from './../lesson/lesson.module';
import { AnswerModule } from './../answer/answer.module';
import { UserAnswerModule } from './../user-answer/user-answer.module';
import { CustomerModule } from './../customer/customer.module';
import { QuizResultModule } from './../quiz-result/quiz-result.module';
import { AttendedQuestionModule } from './../attended-question/attended-question.module';
import { QuizDetailModule } from './../quiz-detail/quiz-detail.module';
import { QuestionModule } from './../question/question.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { ExamLevelModule } from './../exam-level/exam-level.module';
import { QuizTypeModule } from './../quiz-type/quiz-type.module';
import { SubjectModule } from '../subject/subject.module';
import { Quiz } from './../core/models';
import { QuizRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Connection } from 'typeorm';
import { QuizzesController } from './quizzes.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quiz]),
        SubjectModule,
        QuizTypeModule,
        ExamLevelModule,
        AuthModule,
        UserModule,
        forwardRef(() => QuestionModule),
        QuizDetailModule,
        AttendedQuestionModule,
        QuizResultModule,
        CustomerModule,
        UserAnswerModule,
        AnswerModule,
        forwardRef(() => LessonModule),
        DimensionModule,
        RegistrationModule,
    ],
    controllers: [QuizController, QuizzesController],
    providers: [QuizService, { provide: QuizRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizRepository), inject: [Connection] }],
    exports: [QuizService],
})
export class QuizModule {}
