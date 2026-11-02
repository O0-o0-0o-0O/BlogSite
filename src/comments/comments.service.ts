import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity.js';
import { Article } from '../articles/entities/article.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Article) private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { articleId, authorId, content } = createCommentDto;
    const article = await this.articlesRepository.findOne({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException(`Article #${articleId} not found`);
    }
    const comment = this.commentsRepository.create({
      content,
      article,
      author: { id: authorId } as User,
    });
    return this.commentsRepository.save(comment);
  }

  findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ relations: { author: true, article: true } });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: { author: true, article: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`);
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentsRepository.remove(comment);
  }
}
