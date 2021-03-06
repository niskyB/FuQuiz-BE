import { FilterService } from './../core/providers';
import { Question } from './../core/models';
import { QuestionRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(private readonly questionRepository: QuestionRepository, private readonly filterService: FilterService) {}

    async saveQuestion(question: Question): Promise<Question> {
        return await this.questionRepository.save(question);
    }

    async getQuestionByField(field: keyof Question, value: any): Promise<Question> {
        return await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.answers', 'answers')
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where(`question.${field.toString()} = (:value)`, { value })
            .getOne();
    }

    async getQuestionBySubjectId(id: string): Promise<Question[]> {
        return await this.questionRepository
            .createQueryBuilder('Question')
            .leftJoinAndSelect('Question.dimensions', 'dimensions')
            .leftJoinAndSelect('dimensions.subject', 'subject')
            .andWhere('subject.id LIKE (:id)', { id: `%${id}%` })
            .getMany();
    }

    async getQuestionByLessonAndDimension(subjectId: string, lessonId: string, dimensionId: string): Promise<Question[]> {
        return await this.questionRepository
            .createQueryBuilder('question')
            .where('question.isOld = (:isOld)', { isOld: false })
            .andWhere('question.isActive = (:isActive)', { isActive: true })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimensionId}%` })
            .leftJoinAndSelect('question.lesson', 'lesson')
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id = (:subjectId)', { subjectId })
            .andWhere('lesson.id LIKE (:lessonId)', { lessonId: `%${lessonId}%` })
            .getMany();
    }

    async getQuestionsForAdmin(
        subject: string,
        lesson: string,
        dimension: string,
        level: string,
        content: string,
        isActive: boolean,
        currentPage: number,
        pageSize: number,
    ): Promise<{ data: Question[]; count: number }> {
        const activeValue = this.filterService.getMinMaxValue(isActive);
        let questions, count;
        const query = this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where('lesson.id LIKE (:lessonId)', { lessonId: `%${lesson}%` })
            .andWhere('question.isOld = (:isOld)', { isOld: false })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimension}%` })
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .andWhere('questionLevel.id LIKE (:levelId)', { levelId: `%${level}%` })
            .andWhere('question.content LIKE (:content)', { content: `%${content}%` })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('question.isActive = :activeMinValue', {
                        activeMinValue: activeValue.minValue,
                    }).orWhere('question.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                }),
            );

        try {
            questions = await query
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();
            count = await query.getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: questions, count };
    }

    async getQuestionsByUserId(
        id: string,
        subject: string,
        lesson: string,
        dimension: string,
        level: string,
        content: string,
        isActive: boolean,
        currentPage: number,
        pageSize: number,
    ): Promise<{ data: Question[]; count: number }> {
        const activeValue = this.filterService.getMinMaxValue(isActive);
        let questions, count;
        const query = this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.lesson', 'lesson')
            .where('lesson.id LIKE (:lessonId)', { lessonId: `%${lesson}%` })
            .andWhere('question.isOld = (:isOld)', { isOld: false })
            .leftJoinAndSelect('lesson.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .andWhere('user.id = (:id)', { id })
            .leftJoinAndSelect('question.dimensions', 'dimensions')
            .andWhere('dimensions.id LIKE (:dimensionId)', { dimensionId: `%${dimension}%` })
            .leftJoinAndSelect('question.questionLevel', 'questionLevel')
            .andWhere('questionLevel.id LIKE (:levelId)', { levelId: `%${level}%` })
            .andWhere('question.content LIKE (:content)', { content: `%${content}%` })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('question.isActive = :activeMinValue', {
                        activeMinValue: activeValue.minValue,
                    }).orWhere('question.isActive = :activeMaxValue', { activeMaxValue: activeValue.maxValue });
                }),
            );

        try {
            questions = await query
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();
            count = await query.getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: questions, count };
    }
}
