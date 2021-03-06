import { Answer } from './../core/models';
import { AnswerRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnswerService {
    constructor(private readonly answerRepository: AnswerRepository) {}

    async saveAnswer(answer: Answer): Promise<Answer> {
        return await this.answerRepository.save(answer);
    }

    async getAnswerByField(field: keyof Answer, value: any): Promise<Answer> {
        return await this.answerRepository.createQueryBuilder('answer').where(`answer.${field.toString()} = (:value)`, { value }).getOne();
    }

    async getNumberOfCorrectAnswer(question: string): Promise<number> {
        return await this.answerRepository
            .createQueryBuilder('answer')
            .where('answer.isCorrect = (:isCorrect)', { isCorrect: true })
            .leftJoinAndSelect('answer.question', 'question')
            .andWhere('question.id = (:questionId)', { questionId: question })
            .getCount();
    }
}
