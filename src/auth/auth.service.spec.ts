import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../common/security/password.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';

describe('AuthService', () => {
  let service: AuthService;

  const userServiceMock = {
    findByEmailWithPassword: jest.fn(),
  };
  const passwordServiceMock = {
    compare: jest.fn(),
  };
  const jwtTokenServiceMock = {
    sign: jest.fn(),
  };

  const user: UserEntity = {
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    passwordHash: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: PasswordService,
          useValue: passwordServiceMock,
        },
        {
          provide: JwtTokenService,
          useValue: jwtTokenServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access token and user when credentials are valid', async () => {
    userServiceMock.findByEmailWithPassword.mockResolvedValue(user);
    passwordServiceMock.compare.mockResolvedValue(true);
    jwtTokenServiceMock.sign.mockReturnValue('access-token');

    const result = await service.login({
      email: 'maria.silva@email.com',
      password: 'senha123',
    });

    expect(userServiceMock.findByEmailWithPassword).toHaveBeenCalledWith(
      'maria.silva@email.com',
    );
    expect(passwordServiceMock.compare).toHaveBeenCalledWith(
      'senha123',
      'hashed-password',
    );
    expect(jwtTokenServiceMock.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'maria.silva@email.com',
    });
    expect(result).toEqual({
      accessToken: 'access-token',
      tokenType: 'Bearer',
      user: {
        id: 1,
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        createdAt: user.createdAt,
      },
    });
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    userServiceMock.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'maria.silva@email.com',
        password: 'senha123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    userServiceMock.findByEmailWithPassword.mockResolvedValue(user);
    passwordServiceMock.compare.mockResolvedValue(false);

    await expect(
      service.login({
        email: 'maria.silva@email.com',
        password: 'senha123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
