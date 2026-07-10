import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DisciplineEntity } from './entities/discipline.entity';
import { DisciplineService } from './discipline.service';

describe('DisciplineService', () => {
  let service: DisciplineService;

  const repositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplineService,
        {
          provide: getRepositoryToken(DisciplineEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<DisciplineService>(DisciplineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
