import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from './entities/article.entity.js';
import { Tag } from '../tags/entities/tag.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private readonly articlesRepository: Repository<Article>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  private resolveTags(tagIds?: number[]): Promise<Tag[]> {
    if (!tagIds || tagIds.length === 0) {
      return Promise.resolve([]);
    }
    return this.tagsRepository.find({ where: { id: In(tagIds) } });
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const { authorId, tagIds, ...rest } = createArticleDto;
    const article = this.articlesRepository.create({
      ...rest,
      // id-only partial reference: TypeORM resolves the relation without an extra fetch.
      author: { id: authorId } as User,
      tags: await this.resolveTags(tagIds),
    });
    return this.articlesRepository.save(article);
  }

  findAll(): Promise<Article[]> {
    return this.articlesRepository.find({ relations: { author: true, tags: true } });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: { author: true, tags: true, comments: { author: true } },
    });
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    const { tagIds, ...rest } = updateArticleDto;
    Object.assign(article, rest);
    if (tagIds) {
      article.tags = await this.resolveTags(tagIds);
    }
    return this.articlesRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }
}
