import { Injectable } from '@nestjs/common';
import { DisciplineResponseDto } from './dto/response/discipline-response.dto';
import { DisciplineEntity } from './entities/discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectRepository(DisciplineEntity)
    private readonly repository: Repository<DisciplineEntity>,
  ) {}

  async findAll(name?: string): Promise<DisciplineResponseDto[]> {
    const disciplinas = await this.repository.find({
      where: { name: name ? ILike(`%${name}%`) : undefined },
      order: {
        name: 'ASC',
      },
    });

    return disciplinas.map((disciplina) => ({
      id: disciplina.id,
      name: disciplina.name,
    }));
  }
}
