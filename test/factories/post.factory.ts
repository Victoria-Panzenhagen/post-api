import { faker } from '@faker-js/faker';
import { PostEntity } from '../../src/post/entities/post.entity';
import { DisciplineFactory } from './discipline.factory';
import { UserFactory } from './user.factory';

export class PostFactory {
  static create(overrides: Partial<PostEntity> = {}): PostEntity {
    const user = UserFactory.create();

    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      discipline: DisciplineFactory.create(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
      user,
      userId: user.id,
      ...overrides,
    };
  }

  static createMany(
    count: number,
    overrides: Partial<PostEntity> = {},
  ): PostEntity[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
