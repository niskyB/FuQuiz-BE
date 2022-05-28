import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';
import { Blog } from '../models';

@EntityRepository(Blog)
export class BlogRepository extends RepositoryService<Blog> {
    public async findOneByField(field: keyof Blog, value: any): Promise<Blog> {
        return await this.createQueryBuilder('Blog')
            .where(`Blog.${field} = :value`, { value })
            .leftJoinAndSelect('Blog.category', 'category')
            .leftJoinAndSelect('Blog.marketing', 'marketing')
            .getOne();
    }
}
