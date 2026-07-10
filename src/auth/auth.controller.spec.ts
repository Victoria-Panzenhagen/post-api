import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user', async () => {
    const loginDto = {
      email: 'maria.silva@email.com',
      password: 'senha123',
    };
    const response = {
      accessToken: 'access-token',
      tokenType: 'Bearer',
      user: {
        id: 1,
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    };
    authServiceMock.login.mockResolvedValue(response);

    await expect(controller.login(loginDto)).resolves.toEqual(response);
    expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
  });
});
