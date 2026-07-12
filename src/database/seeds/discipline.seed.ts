import { DataSource } from 'typeorm';
import { DisciplineEntity } from '../../discipline/entities/discipline.entity';

export async function runDisciplineSeed(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(DisciplineEntity);

  await repository.upsert(
    [
      { name: 'Matemática' },
      { name: 'Português' },
      { name: 'História' },
      { name: 'Geografia' },
      { name: 'Ciências' },
      { name: 'Biologia' },
      { name: 'Física' },
      { name: 'Química' },
      { name: 'Inglês' },
      { name: 'Educação Física' },
    ],
    ['name'],
  );

  console.log('✔ Discipline seed executada.');
}
