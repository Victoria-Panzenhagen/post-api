import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DisciplineFactory, PostFactory } from '../../test/factories';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';
import { PostEntity } from './entities/post.entity';
import { PostResponseDto } from './dto/response/post-response.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

describe('PostService', () => {
  let service: PostService;
  const queryBuilderMock = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const repositoryMock = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
  };
  const disciplineRepositoryMock = {
    findOneBy: jest.fn(),
  };
  const discipline = DisciplineFactory.create({
    id: 1,
    name: 'Geografia',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  });
  const user: JwtPayload = {
    sub: 1,
    email: 'victoria@email.com',
  };
  const post = PostFactory.create({
    id: 1,
    title: 'Título do post',
    content: 'Conteúdo do post',
    discipline,
    userId: user.sub,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(DisciplineEntity),
          useValue: disciplineRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post with discipline', async () => {
    repositoryMock.findOne.mockResolvedValue(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(discipline);
    repositoryMock.create.mockReturnValue(post);
    repositoryMock.save.mockResolvedValue(post);

    const result = await service.create(
      {
        title: 'Título do post',
        content: 'Conteúdo do post',
        disciplineId: 1,
      },
      user,
    );

    expect(disciplineRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repositoryMock.create).toHaveBeenCalledWith({
      title: 'Título do post',
      content: 'Conteúdo do post',
      discipline,
      user: { id: user.sub },
    });
    expect(result).toEqual(new PostResponseDto(post));
  });

  it('should throw ConflictException when creating post with existing title', async () => {
    repositoryMock.findOne.mockResolvedValue(post);

    await expect(
      service.create(
        {
          title: 'Título do post',
          content: 'Conteúdo do post',
          disciplineId: 1,
        },
        user,
      ),
    ).rejects.toThrow(ConflictException);
    expect(disciplineRepositoryMock.findOneBy).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when discipline does not exist', async () => {
    repositoryMock.findOne.mockResolvedValue(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(null);

    await expect(
      service.create(
        {
          title: 'Título do post',
          content: 'Conteúdo do post',
          disciplineId: 999,
        },
        user,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should list posts with pagination and discipline relation', async () => {
    const posts = PostFactory.createMany(2, { discipline });

    queryBuilderMock.getManyAndCount.mockResolvedValue([posts, 2]);

    const result = await service.findAll({
      page: 1,
      limit: 10,
    });

    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('post');

    expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);

    expect(queryBuilderMock.take).toHaveBeenCalledWith(10);

    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'post.createdAt',
      'DESC',
    );

    expect(result).toEqual({
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      data: posts.map((post) => new PostResponseDto(post)),
    });
  });

  it('should list posts using search filter', async () => {
    const posts = PostFactory.createMany(2, { discipline });

    queryBuilderMock.getManyAndCount.mockResolvedValue([posts, 2]);

    await service.findAll({
      page: 2,
      limit: 5,
      search: 'educação',
    });

    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('post');

    expect(queryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
      'post.discipline',
      'discipline',
    );

    expect(queryBuilderMock.innerJoin).toHaveBeenCalledWith(
      'post.user',
      'user',
    );

    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith(
      'post.createdAt',
      'DESC',
    );

    expect(queryBuilderMock.skip).toHaveBeenCalledWith(5);

    expect(queryBuilderMock.take).toHaveBeenCalledWith(5);

    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      '(post.title ILIKE :search OR post.content ILIKE :search)',
      { search: '%educação%' },
    );
  });

  it('should find one post by id', async () => {
    repositoryMock.findOne.mockResolvedValue(post);

    const result = await service.findOne(1);

    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: {
        discipline: true,
      },
    });
    expect(result).toEqual(new PostResponseDto(post));
  });

  it('should throw NotFoundException when post is not found by id', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a post with discipline', async () => {
    const updatedDiscipline = DisciplineFactory.create({
      id: 2,
      name: 'História',
    });
    const updatedPost = PostFactory.create({
      ...post,
      userId: user.sub,
      title: 'Novo título',
      content: 'Novo conteúdo',
      discipline: updatedDiscipline,
    });

    repositoryMock.findOneBy.mockResolvedValue(post);
    repositoryMock.findOne.mockResolvedValue(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(updatedDiscipline);
    repositoryMock.save.mockResolvedValue(updatedPost);

    const result = await service.update(
      1,
      {
        title: 'Novo título',
        content: 'Novo conteúdo',
        disciplineId: 2,
      },
      user,
    );

    expect(repositoryMock.findOneBy).toHaveBeenNthCalledWith(1, {
      id: 1,
    });
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: expect.objectContaining({
        title: 'Novo título',
      }),
    });
    expect(disciplineRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 2 });
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Novo título',
        content: 'Novo conteúdo',
        discipline: updatedDiscipline,
      }),
    );
    expect(result).toEqual(new PostResponseDto(updatedPost));
  });

  it('should throw ForbiddenException when updating another user post', async () => {
    const anotherUserPost = PostFactory.create({
      id: 1,
      userId: 2, // autor diferente
      discipline,
    });

    repositoryMock.findOneBy.mockResolvedValue(anotherUserPost);

    await expect(
      service.update(
        1,
        {
          title: 'Novo título',
          content: 'Novo conteúdo',
          disciplineId: 1,
        },
        user, // user.sub = 1
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(repositoryMock.findOne).not.toHaveBeenCalled();
    expect(disciplineRepositoryMock.findOneBy).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when updating missing post', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(
        1,
        {
          title: 'Novo título',
          content: 'Novo conteúdo',
          disciplineId: 1,
        },
        user,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException when updating to an existing title', async () => {
    const existingPost = PostFactory.create({
      id: 2,
      title: 'Novo título',
      discipline,
    });

    repositoryMock.findOneBy.mockResolvedValue(post);

    repositoryMock.findOne.mockResolvedValue(existingPost);

    await expect(
      service.update(
        1,
        {
          title: 'Novo título',
          content: 'Novo conteúdo',
          disciplineId: 1,
        },
        user,
      ),
    ).rejects.toThrow(ConflictException);
    expect(disciplineRepositoryMock.findOneBy).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when updating with missing discipline', async () => {
    repositoryMock.findOneBy.mockResolvedValue(post);
    repositoryMock.findOne.mockResolvedValue(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(
        1,
        {
          title: 'Novo título',
          content: 'Novo conteúdo',
          disciplineId: 999,
        },
        user,
      ),
    ).rejects.toThrow(NotFoundException);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should remove a post', async () => {
    const post = PostFactory.create({
      userId: user.sub,
    });

    repositoryMock.findOneBy.mockResolvedValue(post);
    repositoryMock.softDelete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1, user)).resolves.toBeUndefined();

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(1);
  });

  it('should throw ForbiddenException when removing another user post', async () => {
    const anotherUserPost = PostFactory.create({
      id: 1,
      userId: 2,
    });

    repositoryMock.findOneBy.mockResolvedValue(anotherUserPost);

    await expect(service.remove(1, user)).rejects.toThrow(ForbiddenException);

    expect(repositoryMock.softDelete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when removing missing post', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.remove(1, user)).rejects.toThrow(NotFoundException);
  });
});
