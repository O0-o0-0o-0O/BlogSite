import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Article } from './articles/entities/article.entity.js';
import { Comment } from './comments/entities/comment.entity.js';
import { Tag } from './tags/entities/tag.entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'nest_blog',
  entities: [User, Article, Comment, Tag],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const usersRepo = dataSource.getRepository(User);
  const tagsRepo = dataSource.getRepository(Tag);
  const articlesRepo = dataSource.getRepository(Article);
  const commentsRepo = dataSource.getRepository(Comment);

  const alice = await usersRepo.save(usersRepo.create({ email: 'alice@example.com', name: 'Alice' }));
  const bob = await usersRepo.save(usersRepo.create({ email: 'bob@example.com', name: 'Bob' }));

  const [nestjsTag, typeormTag, dbTag] = await tagsRepo.save([
    tagsRepo.create({ name: 'nestjs' }),
    tagsRepo.create({ name: 'typeorm' }),
    tagsRepo.create({ name: 'database' }),
  ]);

  const article1 = await articlesRepo.save(
    articlesRepo.create({
      title: 'NestJSを始めよう',
      content: 'NestJSの基本的なモジュール構成について。',
      published: true,
      author: alice,
      tags: [nestjsTag, typeormTag],
    }),
  );

  const article2 = await articlesRepo.save(
    articlesRepo.create({
      title: 'TypeORMでマイグレーションを使う',
      content: 'synchronizeからmigrationへの移行手順。',
      published: true,
      author: bob,
      tags: [typeormTag, dbTag],
    }),
  );

  await commentsRepo.save([
    commentsRepo.create({ content: '分かりやすいです!', author: bob, article: article1 }),
    commentsRepo.create({ content: 'ありがとうございます', author: alice, article: article2 }),
  ]);

  console.log('シードデータを投入しました: users=2, tags=3, articles=2, comments=2');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('シード投入に失敗しました:', error);
  process.exit(1);
});
