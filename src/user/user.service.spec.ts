import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserFactory } from '../../test/factories';
import { PasswordService } from '../common/security/password.service';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const repositoryMock = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const passwordServiceMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const queryBuilderMock = {
    addSelect: jest.fn(),
    where: jest.fn(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    queryBuilderMock.addSelect.mockReturnValue(queryBuilderMock);
    queryBuilderMock.where.mockReturnValue(queryBuilderMock);
    repositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: repositoryMock,
        },
        {
          provide: PasswordService,
          useValue: passwordServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with hashed password', async () => {
    const user = UserFactory.create({
      id: 1,
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      passwordHash: 'hashed-password',
    });

    repositoryMock.findOne.mockResolvedValue(null);
    passwordServiceMock.hash.mockResolvedValue('hashed-password');
    repositoryMock.create.mockReturnValue(user);
    repositoryMock.save.mockResolvedValue(user);

    const result = await service.create({
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      password: 'senha123',
    });

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { email: 'maria.silva@email.com' },
    });
    expect(passwordServiceMock.hash).toHaveBeenCalledWith('senha123');
    expect(repositoryMock.create).toHaveBeenCalledWith({
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual(new UserResponseDto(user));
  });

  it('should throw ConflictException when creating user with existing email', async () => {
    const user = UserFactory.create({
      email: 'maria.silva@email.com',
    });

    repositoryMock.findOne.mockResolvedValue(user);

    await expect(
      service.create({
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        password: 'senha123',
      }),
    ).rejects.toThrow(ConflictException);
    expect(passwordServiceMock.hash).not.toHaveBeenCalled();
  });

  it('should list users with pagination', async () => {
    const users = UserFactory.createMany(2);

    repositoryMock.findAndCount.mockResolvedValue([users, 2]);

    const result = await service.findAll({
      page: 1,
      limit: 10,
    });

    expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      order: {
        createdAt: 'DESC',
      },
    });
    expect(result).toEqual({
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      data: users.map((user) => new UserResponseDto(user)),
    });
  });

  it('should list users using search filter', async () => {
    repositoryMock.findAndCount.mockResolvedValue([[], 0]);

    await service.findAll({
      page: 2,
      limit: 5,
      search: 'maria',
    });

    expect(repositoryMock.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Array),
        skip: 5,
        take: 5,
      }),
    );
  });

  it('should find one user by id', async () => {
    const user = UserFactory.create({ id: 1 });

    repositoryMock.findOneBy.mockResolvedValue(user);

    const result = await service.findOne(1);

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(new UserResponseDto(user));
  });

  it('should throw NotFoundException when user is not found by id', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should find user by email with password', async () => {
    const user = UserFactory.create({
      email: 'maria.silva@email.com',
    });

    queryBuilderMock.getOne.mockResolvedValue(user);

    const result = await service.findByEmailWithPassword(
      'maria.silva@email.com',
    );

    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(queryBuilderMock.addSelect).toHaveBeenCalledWith(
      'user.passwordHash',
    );
    expect(queryBuilderMock.where).toHaveBeenCalledWith(
      'user.email = :email',
      { email: 'maria.silva@email.com' },
    );
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const user = UserFactory.create({
      id: 1,
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
    });
    const updatedUser = UserFactory.create({
      ...user,
      name: 'Maria Souza',
      email: 'maria.souza@email.com',
      passwordHash: 'new-hashed-password',
    });

    repositoryMock.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    passwordServiceMock.hash.mockResolvedValue('new-hashed-password');
    repositoryMock.save.mockResolvedValue(updatedUser);

    const result = await service.update(1, {
      name: 'Maria Souza',
      email: 'maria.souza@email.com',
      password: 'novaSenha123',
    });

    expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, {
      where: { id: 1 },
    });
    expect(repositoryMock.findOne).toHaveBeenNthCalledWith(2, {
      where: expect.objectContaining({ email: 'maria.souza@email.com' }),
    });
    expect(passwordServiceMock.hash).toHaveBeenCalledWith('novaSenha123');
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Maria Souza',
        email: 'maria.souza@email.com',
        passwordHash: 'new-hashed-password',
      }),
    );
    expect(result).toEqual(new UserResponseDto(updatedUser));
  });

  it('should update a user without changing password', async () => {
    const user = UserFactory.create({
      id: 1,
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      passwordHash: 'current-hash',
    });
    const updatedUser = UserFactory.create({
      ...user,
      name: 'Maria Souza',
    });

    repositoryMock.findOne.mockResolvedValue(user);
    repositoryMock.save.mockResolvedValue(updatedUser);

    const result = await service.update(1, {
      name: 'Maria Souza',
    });

    expect(passwordServiceMock.hash).not.toHaveBeenCalled();
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Maria Souza',
        email: 'maria.silva@email.com',
        passwordHash: 'current-hash',
      }),
    );
    expect(result).toEqual(new UserResponseDto(updatedUser));
  });

  it('should throw NotFoundException when updating missing user', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(
      service.update(1, {
        name: 'Maria Souza',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException when updating to an existing email', async () => {
    const user = UserFactory.create({
      id: 1,
      email: 'maria.silva@email.com',
    });
    const existingUser = UserFactory.create({
      id: 2,
      email: 'maria.souza@email.com',
    });

    repositoryMock.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(existingUser);

    await expect(
      service.update(1, {
        email: 'maria.souza@email.com',
      }),
    ).rejects.toThrow(ConflictException);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should remove a user', async () => {
    const user = UserFactory.create({ id: 1 });

    repositoryMock.findOneBy.mockResolvedValue(user);
    repositoryMock.softDelete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBeUndefined();

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when removing missing user', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
