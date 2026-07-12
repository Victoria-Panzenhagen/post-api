import { faker } from '@faker-js/faker';
import { UserEntity } from '../../src/user/entities/user.entity';

export class UserFactory {
  static create(overrides: Partial<UserEntity> = {}): UserEntity {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      passwordHash: faker.string.hexadecimal({ length: 128, prefix: '' }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
      ...overrides,
    };
  }

  static createMany(
    count: number,
    overrides: Partial<UserEntity> = {},
  ): UserEntity[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
