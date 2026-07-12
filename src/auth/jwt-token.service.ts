import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

type JwtPayload = Record<string, string | number>;

@Injectable()
export class JwtTokenService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: JwtPayload): string {
    const secret = this.configService.get<string>('jwt.secret') ?? 'secret';
    const expiresIn = this.configService.get<string>('jwt.expiresIn') ?? '1h';
    const expiresAt =
      Math.floor(Date.now() / 1000) + this.parseExpiresIn(expiresIn);
    const header = { alg: 'HS256', typ: 'JWT' };
    const tokenPayload = {
      ...payload,
      exp: expiresAt,
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    const signature = this.signContent(
      `${encodedHeader}.${encodedPayload}`,
      secret,
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private signContent(content: string, secret: string): string {
    return createHmac('sha256', secret).update(content).digest('base64url');
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value).toString('base64url');
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = /^(\d+)([smhd])?$/.exec(expiresIn);

    if (!match) {
      return 60 * 60;
    }

    const value = Number(match[1]);
    const unit = match[2] ?? 's';
    const multipliers = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    };

    return value * multipliers[unit as keyof typeof multipliers];
  }
}
