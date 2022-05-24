import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { JoiMessage } from 'joi-message';
import { DimensionType } from './dimension-type';

@Entity()
export class Dimension {
    @ApiProperty({ description: 'Id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'Description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'Dimension Type' })
    @ManyToOne(() => DimensionType)
    type: DimensionType;
}

export const dimensionValidateSchema = {
    name: joi
        .string()
        .min(3)
        .max(40)
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Name', min: 3, max: 40 })),
    description: joi
        .string()
        .trim()
        .required()
        .messages(JoiMessage.createStringMessages({ field: 'Description' })),
};
