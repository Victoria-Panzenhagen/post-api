import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Título do post' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Conteúdo do post' })
  @IsNotEmpty()
  @IsString()
  content!: string;
}
