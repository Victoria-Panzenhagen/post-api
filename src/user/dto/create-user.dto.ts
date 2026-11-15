
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'Maria Silva' })
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim() : String(value),
  )
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'maria@email.com',
  })
  @Transform(({ value }: TransformFnParams): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : String(value),
  )
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password!: string;

  @ApiProperty({
    description: 'Perfil do usuário',
    enum: UserRole,
    example: UserRole.ALUNO,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}
