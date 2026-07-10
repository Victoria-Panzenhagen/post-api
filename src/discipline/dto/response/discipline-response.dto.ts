import { ApiProperty } from '@nestjs/swagger';

export class DisciplineResponseDto {
  @ApiProperty({ description: 'Identificador único da disciplina', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Nome da disciplina', example: 'Geografia' })
  name!: string;
}
