import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Article } from './articles/entities/article.entity.js';
import { Comment } from './comments/entities/comment.entity.js';
import { Tag } from './tags/entities/tag.entity.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'nest_blog',
  entities: [User, Article, Comment, Tag],
  migrations: ['src/migrations/*.ts'],
  // CLIはこのファイル経由でのみDBを操作するため、ここは常にfalse(自動同期はしない)
  synchronize: false,
});

export default AppDataSource;
