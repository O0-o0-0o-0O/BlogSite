import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service.js';
import { CommentsController } from './comments.controller.js';
import { Comment } from './entities/comment.entity.js';
import { Article } from '../articles/entities/article.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Article])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
