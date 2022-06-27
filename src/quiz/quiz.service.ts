import { Quiz } from './../core/models';
import { QuizRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
    constructor(private readonly quizRepository: QuizRepository) {}

    async saveQuiz(quiz: Quiz): Promise<Quiz> {
        return await this.quizRepository.save(quiz);
    }

    async deleteQuiz(quiz: Quiz) {
        return await this.quizRepository.delete(quiz);
    }

    async getQuizByField(field: keyof Quiz, value: any): Promise<Quiz> {
        return await this.quizRepository
            .createQueryBuilder('quiz')
            .where(`quiz.${field.toString()} = (:value)`, { value })
            .leftJoinAndSelect('quiz.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect('quiz.type', 'type')
            .leftJoinAndSelect('quiz.level', 'level')
            .getOne();
    }

    async filterQuizzes({ name, subject, type }): Promise<{ data: Quiz[]; count: number }> {
        let quizzes, count;
        try {
            quizzes = await this.quizRepository
                .createQueryBuilder('quiz')
                .where('quiz.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('quiz.subject', 'subject')
                .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .leftJoinAndSelect('quiz.type', 'type')
                .andWhere('type.id LIKE (:typeId)', { typeId: `%${type}%` })
                .leftJoinAndSelect('quiz.level', 'level')
                .getMany();
            count = await this.quizRepository
                .createQueryBuilder('quiz')
                .where('quiz.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('quiz.subject', 'subject')
                .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .leftJoinAndSelect('quiz.type', 'type')
                .andWhere('type.id LIKE (:typeId)', { typeId: `%${type}%` })
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: quizzes, count };
    }

    async filterSimulationExams(userId: string, subject: string, name: string, currentPage: number, pageSize: number): Promise<{ data: Quiz[]; count: number }> {
        let simulationExams, count;
        try {
            simulationExams = await this.quizRepository
                .createQueryBuilder('quiz')
                .leftJoinAndSelect('quiz.subject', 'subject')
                .leftJoinAndSelect('subject.pricePackages', 'pricePackages')
                .leftJoinAndSelect('pricePackages.registrations', 'registrations')
                .leftJoinAndSelect('registrations.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .where('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .andWhere('user.id = (:userId)', { userId: `%${userId}%` })
                .andWhere('quiz.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('quiz.type', 'type')
                .leftJoinAndSelect('quiz.level', 'level')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.quizRepository
                .createQueryBuilder('quiz')
                .leftJoinAndSelect('quiz.subject', 'subject')
                .leftJoinAndSelect('subject.pricePackages', 'pricePackages')
                .leftJoinAndSelect('pricePackages.registrations', 'registrations')
                .leftJoinAndSelect('registrations.customer', 'customer')
                .leftJoinAndSelect('customer.user', 'user')
                .where('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .andWhere('user.id = (:userId)', { userId: `%${userId}%` })
                .andWhere('quiz.name LIKE (:name)', { name: `%${name}%` })
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: simulationExams, count };
    }
}
