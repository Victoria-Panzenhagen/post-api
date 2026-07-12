import { Module } from '@nestjs/common';
import { PasswordService } from '../common/security/password.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, PasswordService],
})
export class AuthModule {}
