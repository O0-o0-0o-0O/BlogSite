import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Article } from '../../articles/entities/article.entity.js';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Relation<Article>[];
}
