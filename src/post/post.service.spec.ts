import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';
import { NotFoundException } from '@nestjs/common';

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
  const discipline: DisciplineEntity = {
    id: 1,
    name: 'Geografia',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };
  const post: PostEntity = {
    id: 1,
    title: 'Título do post',
    content: 'Conteúdo do post',
    discipline,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  };

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
    expect(result).toEqual({
      id: 1,
      title: 'Título do post',
      content: 'Conteúdo do post',
      discipline: {
        id: 1,
        name: 'Geografia',
      },
      createdAt: post.createdAt,
    });
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
});
