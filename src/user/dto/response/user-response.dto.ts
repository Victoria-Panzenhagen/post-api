import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/enums/user-role.enum';

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

  @ApiProperty({
    description: 'Perfil do usuário',
    enum: UserRole,
    example: UserRole.ALUNO,
  })
  role!: UserRole;
  
  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }
}
