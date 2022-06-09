import { Quiz } from './../core/models';
import { QuizRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
    constructor(private readonly quizRepository: QuizRepository) {}

    async getQuizByField(field: keyof Quiz, value: any): Promise<Quiz> {
        return await this.quizRepository.findOneByField(field, value);
    }
}