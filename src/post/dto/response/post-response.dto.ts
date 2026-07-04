import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from 'src/post/entities/post.entity';

export class PostResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: Date;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.createdAt = post.createdAt;
  }
}
