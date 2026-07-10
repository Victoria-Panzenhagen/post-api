import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../user/dto/response/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  accessToken!: string;

  @ApiProperty({ description: 'Tipo do token', example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ description: 'Dados do usuário autenticado' })
  user!: UserResponseDto;
}
