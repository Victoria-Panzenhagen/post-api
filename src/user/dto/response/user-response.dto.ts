import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'Identificador único do usuário', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Nome do usuário', example: 'Maria Silva' })
  name!: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'maria.silva@email.com',
  })
  email!: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
