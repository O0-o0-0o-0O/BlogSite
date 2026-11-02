import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Article } from '../../articles/entities/article.entity.js';
import { Comment } from '../../comments/entities/comment.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles: Relation<Article>[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Relation<Comment>[];
}
