import { faker } from '@faker-js/faker';
import { DisciplineEntity } from '../../src/discipline/entities/discipline.entity';

export class DisciplineFactory {
  static create(overrides: Partial<DisciplineEntity> = {}): DisciplineEntity {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.lorem.words(2),
      createdAt: faker.date.past(),
      ...overrides,
    };
  }

  static createMany(
    count: number,
    overrides: Partial<DisciplineEntity> = {},
  ): DisciplineEntity[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
