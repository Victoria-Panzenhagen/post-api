import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';

describe('PostController', () => {
  let controller: PostController;
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

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
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

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
