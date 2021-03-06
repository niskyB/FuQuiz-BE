import { dimensionValidateSchema } from './../../core/models';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import JoiMessage from 'joi-message';

export class CreateDimensionDTO {
    @ApiProperty({ description: 'Name', example: 'Dimension 1' })
    name: string;

    @ApiProperty({ description: 'Description', example: 'Description 1' })
    description: string;

    @ApiProperty({ description: 'Type Id', example: '1aa-a2d-asxd' })
    type: string;

    @ApiProperty({ description: 'Subject Id', example: 'asfsdf-asdfsdf-ss' })
    subject: string;
}

export const vCreateDimensionDTO = joi.object<CreateDimensionDTO>({
    name: dimensionValidateSchema.name,
    description: dimensionValidateSchema.description,
    type: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Type' })),
    subject: joi
        .string()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Subject' })),
});
