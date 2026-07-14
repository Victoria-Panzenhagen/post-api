import { ApiProperty } from '@nestjs/swagger';
import { DisciplineEntity } from '../../entities/discipline.entity';

export class DisciplineResponseDto {
  @ApiProperty({ description: 'Identificador único da disciplina', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Nome da disciplina', example: 'Geografia' })
  name!: string;

  constructor(discipline: DisciplineEntity) {
    this.id = discipline.id;
    this.name = discipline.name;
  }
}
