import { JoiMessage } from 'joi-message';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

export class FilterQuizzesDTO {
    @ApiProperty({ description: 'Subject Id', example: 'asdf-asdf-aasdf' })
    subject: string;

    @ApiProperty({ description: 'Quiz Type Id', example: '123-asdf-12' })
    type: string;

    @ApiProperty({ description: 'Quiz Name', example: 'Quiz 1' })
    name: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;
}

export const vFilterQuizzesDTO = joi.object<FilterQuizzesDTO>({
    name: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Name' })),
    type: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Quiz Type' })),
    subject: joi
        .string()
        .required()
        .failover('')
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
