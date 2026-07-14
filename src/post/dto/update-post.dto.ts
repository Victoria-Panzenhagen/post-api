import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'The content of the post' })
  @IsString()
  content!: string;

  @ApiProperty({ description: 'Identificador da disciplina', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplineId!: number;
}
