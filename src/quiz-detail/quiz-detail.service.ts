import { QuizDetailRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { QuizDetail } from '../core/models';

@Injectable()
export class QuizDetailService {
    constructor(private readonly quizDetailRepository: QuizDetailRepository) {}

    async saveQuizDetail(quizDetail: QuizDetail): Promise<QuizDetail> {
        return await this.quizDetailRepository.save(quizDetail);
    }

    async deleteQuizDetail(quizDetail: QuizDetail) {
        return await this.quizDetailRepository.delete(quizDetail);
    }

    async getQuizDetailsByQuizId(id: string): Promise<QuizDetail[]> {
        return await this.quizDetailRepository
            .createQueryBuilder('quiz_detail')
            .leftJoinAndSelect('quiz_detail.quiz', 'quiz')
            .where('quiz.id = (:id)', { id })
            .leftJoinAndSelect('quiz_detail.question', 'question')
            .andWhere('question.isActive = (:isActive)', { isActive: true })
            .leftJoinAndSelect('question.answers', 'answers')
            .getMany();
    }

    async getQuizDetailsByQuestionId(id: string): Promise<QuizDetail[]> {
        return await this.quizDetailRepository
            .createQueryBuilder('quiz_detail')
            .leftJoinAndSelect('quiz_detail.quiz', 'quiz')
            .leftJoinAndSelect('quiz_detail.question', 'question')
            .where('question.id = (:id)', { id })
            .leftJoinAndSelect('quiz.type', 'type')
            .leftJoinAndSelect('quiz.level', 'level')
            .leftJoinAndSelect('quiz.subject', 'subject')
            .leftJoinAndSelect('question.answers', 'answers')
            .getMany();
    }

    async getQuizDetailByQuizIdAndQuestionId(quizId: string, questionId: string): Promise<QuizDetail> {
        return await this.quizDetailRepository
            .createQueryBuilder('quiz_detail')
            .leftJoinAndSelect('quiz_detail.quiz', 'quiz')
            .where('quiz.id = (:quizId)', { quizId })
            .leftJoinAndSelect('quiz_detail.question', 'question')
            .andWhere('question.isActive = (:isActive)', { isActive: true })
            .leftJoinAndSelect('question.answers', 'answers')
            .andWhere('question.id = (:questionId)', { questionId })
            .getOne();
    }
}
