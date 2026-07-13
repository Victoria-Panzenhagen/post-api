import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../common/security/password.service';
import { UserResponseDto } from '../user/dto/response/user-response.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordMatches = await this.passwordService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      user: new UserResponseDto(user),
    };
  }
}
