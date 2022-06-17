import { QuestionLevelService } from './../question-level/question-level.service';
import { AnswerService } from './../answer/answer.service';
import { LessonService } from './../lesson/lesson.service';
import { ExpertGuard } from './../auth/guard';
import { DimensionService } from './../dimension/dimension.service';
import { S3Service } from '../core/providers/s3/s3.service';
import { Answer, Question } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionService } from './question.service';
import { Body, Controller, Get, HttpException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseMessage } from '../core/interface';
import { StatusCodes } from 'http-status-codes';
import { CreateQuestionDTO, vCreateQuestionDTO } from './dto';

@ApiTags('question')
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly s3Service: S3Service,
        private readonly dimensionService: DimensionService,
        private readonly lessonService: LessonService,
        private readonly answerService: AnswerService,
        private readonly questionLevelService: QuestionLevelService,
    ) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuestionById(@Param('id') id: string, @Res() res: Response) {
        const question = await this.questionService.getQuestionByField('id', id);

        if (!question) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(question);
    }

    @Post('')
    @UseGuards(ExpertGuard)
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateQuestionDTO))
    async cCreateQuestion(@Res() res: Response, @Body() body: CreateQuestionDTO, @UploadedFile() file: Express.Multer.File) {
        const countCorrect = body.answers.reduce((total, item) => {
            if (item.isCorrect) return total + 1;
            return total;
        }, 0);

        if (countCorrect <= 0) throw new HttpException({ errorMessage: ResponseMessage.QUESTION_ANSWER_CORRECT_ERROR }, StatusCodes.BAD_REQUEST);
        if (countCorrect > 1 && !body.isMultipleChoice) throw new HttpException({ errorMessage: ResponseMessage.SINGLE_CHOICE_ERROR }, StatusCodes.BAD_REQUEST);
        if (countCorrect <= 1 && body.isMultipleChoice) throw new HttpException({ errorMessage: ResponseMessage.MULTIPLE_CHOICE_ERROR }, StatusCodes.BAD_REQUEST);

        const questionLevel = await this.questionLevelService.getOneByField('id', body.questionLevel);
        if (!questionLevel) throw new HttpException({ questionLevel: ResponseMessage.QUESTION_LEVEL_ERROR }, StatusCodes.BAD_REQUEST);

        const newQuestion = new Question();
        newQuestion.content = body.content;
        newQuestion.audioLink = body.audioLink;
        newQuestion.videoLink = body.videoLink;
        newQuestion.isMultipleChoice = body.isMultipleChoice;
        newQuestion.isActive = body.isActive;
        newQuestion.explanation = body.explanation;
        newQuestion.questionLevel = questionLevel;
        newQuestion.dimensions = [];

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) newQuestion.imageUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const dimensions = body.dimensions.split(',');
        for (const item of dimensions) {
            const dimension = await this.dimensionService.getDimensionByField('id', item);
            newQuestion.dimensions.push(dimension);
        }

        if (newQuestion.dimensions.length === 0) throw new HttpException({ dimensions: ResponseMessage.INVALID_DIMENSION }, StatusCodes.BAD_REQUEST);

        const lesson = await this.lessonService.getLessonByField('id', body.lesson);
        if (!lesson) throw new HttpException({ lesson: ResponseMessage.INVALID_LESSON }, StatusCodes.BAD_REQUEST);
        newQuestion.lesson = lesson;

        await this.questionService.saveQuestion(newQuestion);

        for (const item of body.answers) {
            const answer = new Answer();
            answer.detail = item.detail;
            answer.isCorrect = item.isCorrect;
            answer.question = newQuestion;

            await this.answerService.saveAnswer(answer);
        }

        return res.send(newQuestion);
    }
}
