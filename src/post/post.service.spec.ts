import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DisciplineFactory, PostFactory } from '../../test/factories';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';
import { PostEntity } from './entities/post.entity';
import { PostResponseDto } from './dto/response/post-response.dto';

describe('PostService', () => {
  let service: PostService;
  const repositoryMock = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };
  const disciplineRepositoryMock = {
    findOneBy: jest.fn(),
  };
  const discipline = DisciplineFactory.create({
    id: 1,
    name: 'Geografia',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  });
  const post = PostFactory.create({
    id: 1,
    title: 'Título do post',
    content: 'Conteúdo do post',
    discipline,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  });

  beforeEach(async () => {
    jest.resetAllMocks();

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

    const result = await service.create({
      title: 'Título do post',
      content: 'Conteúdo do post',
      disciplineId: 1,
    });

    expect(disciplineRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repositoryMock.create).toHaveBeenCalledWith({
      title: 'Título do post',
      content: 'Conteúdo do post',
      discipline,
    });
    expect(result).toEqual(new PostResponseDto(post));
  });

  it('should throw ConflictException when creating post with existing title', async () => {
    repositoryMock.findOne.mockResolvedValue(post);

    await expect(
      service.create({
        title: 'Título do post',
        content: 'Conteúdo do post',
        disciplineId: 1,
      }),
    ).rejects.toThrow(ConflictException);
    expect(disciplineRepositoryMock.findOneBy).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when discipline does not exist', async () => {
    repositoryMock.findOne.mockResolvedValue(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        title: 'Título do post',
        content: 'Conteúdo do post',
        disciplineId: 999,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should list posts with pagination and discipline relation', async () => {
    const posts = PostFactory.createMany(2, { discipline });

    repositoryMock.findAndCount.mockResolvedValue([posts, 2]);

    const result = await service.findAll({
      page: 1,
      limit: 10,
    });

    expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
      where: {},
      relations: {
        discipline: true,
      },
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
      data: posts.map((post) => new PostResponseDto(post)),
    });
  });

  it('should list posts using search filter', async () => {
    repositoryMock.findAndCount.mockResolvedValue([[], 0]);

    await service.findAll({
      page: 2,
      limit: 5,
      search: 'educação',
    });

    expect(repositoryMock.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Array),
        relations: {
          discipline: true,
        },
        skip: 5,
        take: 5,
      }),
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
      title: 'Novo título',
      content: 'Novo conteúdo',
      discipline: updatedDiscipline,
    });

    repositoryMock.findOne
      .mockResolvedValueOnce(post)
      .mockResolvedValueOnce(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(updatedDiscipline);
    repositoryMock.save.mockResolvedValue(updatedPost);

    const result = await service.update(1, {
      title: 'Novo título',
      content: 'Novo conteúdo',
      disciplineId: 2,
    });

    expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, {
      where: { id: 1 },
    });
    expect(repositoryMock.findOne).toHaveBeenNthCalledWith(2, {
      where: expect.objectContaining({ title: 'Novo título' }),
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

  it('should throw NotFoundException when updating missing post', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(
      service.update(1, {
        title: 'Novo título',
        content: 'Novo conteúdo',
        disciplineId: 1,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException when updating to an existing title', async () => {
    const existingPost = PostFactory.create({
      id: 2,
      title: 'Novo título',
      discipline,
    });

    repositoryMock.findOne
      .mockResolvedValueOnce(post)
      .mockResolvedValueOnce(existingPost);

    await expect(
      service.update(1, {
        title: 'Novo título',
        content: 'Novo conteúdo',
        disciplineId: 1,
      }),
    ).rejects.toThrow(ConflictException);
    expect(disciplineRepositoryMock.findOneBy).not.toHaveBeenCalled();
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when updating with missing discipline', async () => {
    repositoryMock.findOne
      .mockResolvedValueOnce(post)
      .mockResolvedValueOnce(null);
    disciplineRepositoryMock.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(1, {
        title: 'Novo título',
        content: 'Novo conteúdo',
        disciplineId: 999,
      }),
    ).rejects.toThrow(NotFoundException);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('should remove a post', async () => {
    repositoryMock.findOneBy.mockResolvedValue(post);
    repositoryMock.softDelete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBeUndefined();

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when removing missing post', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
