import { IsString, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsInt()
  articleId: number;

  @IsInt()
  authorId: number;
}
