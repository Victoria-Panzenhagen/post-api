import { ApiProperty } from '@nestjs/swagger';
import { DisciplineResponseDto } from '../../../discipline/dto/response/discipline-response.dto';
import { PostEntity } from 'src/post/entities/post.entity';

export class PostResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ type: DisciplineResponseDto })
  discipline!: DisciplineResponseDto;

  @ApiProperty()
  createdAt!: Date;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.discipline = new DisciplineResponseDto(post.discipline);
    this.createdAt = post.createdAt;
  }
}
