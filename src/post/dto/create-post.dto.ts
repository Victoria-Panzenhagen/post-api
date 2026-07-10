import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Título do post' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Conteúdo do post' })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({ description: 'Identificador da disciplina', example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  disciplineId!: number;
}
