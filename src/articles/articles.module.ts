import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service.js';
import { ArticlesController } from './articles.controller.js';
import { Article } from './entities/article.entity.js';
import { Tag } from '../tags/entities/tag.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
