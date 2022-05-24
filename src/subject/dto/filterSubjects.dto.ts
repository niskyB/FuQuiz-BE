import { subjectValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
export class FilterSubjectsDTO {
    @ApiProperty({ description: 'Name', example: 'Subject 1', nullable: true })
    name: string;

    @ApiProperty({ description: 'Is Active', example: 'true', nullable: true })
    isActive: boolean;

    @ApiProperty({ description: 'Category', example: 'Category 1', nullable: true })
    category: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Created At', example: '18/5/2022', nullable: true })
    createdAt: string;
}

export const vFilterSubjectsDTO = joi.object<FilterSubjectsDTO>({
    name: subjectValidateSchema.name.failover(''),
    isActive: joi.boolean().required().failover(null),
    category: joi.string().required().failover(''),
    createdAt: joi.string().required().failover('1/1/2022'),
    currentPage: joi.number().min(0).required().failover(0),
    pageSize: joi.number().min(1).required().failover(4),
});
