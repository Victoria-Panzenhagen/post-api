import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ description: 'The title of the post' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'The content of the post' })
  @IsString()
  content!: string;
}
