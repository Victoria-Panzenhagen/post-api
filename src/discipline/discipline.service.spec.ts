import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DisciplineFactory } from '../../test/factories';
import { DisciplineResponseDto } from './dto/response/discipline-response.dto';
import { DisciplineEntity } from './entities/discipline.entity';
import { DisciplineService } from './discipline.service';

describe('DisciplineService', () => {
  let service: DisciplineService;

  const repositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

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

  it('should list disciplines ordered by name', async () => {
    const disciplines = DisciplineFactory.createMany(2);

    repositoryMock.find.mockResolvedValue(disciplines);

    const result = await service.findAll();

    expect(repositoryMock.find).toHaveBeenCalledWith({
      where: { name: undefined },
      order: {
        name: 'ASC',
      },
    });
    expect(result).toEqual(
      disciplines.map((discipline) => new DisciplineResponseDto(discipline)),
    );
  });

  it('should list disciplines filtered by name', async () => {
    const discipline = DisciplineFactory.create({
      id: 1,
      name: 'Geografia',
    });

    repositoryMock.find.mockResolvedValue([discipline]);

    const result = await service.findAll('Geografia');

    expect(repositoryMock.find).toHaveBeenCalledWith({
      where: { name: 'Geografia' },
      order: {
        name: 'ASC',
      },
    });
    expect(result).toEqual([new DisciplineResponseDto(discipline)]);
  });
});
