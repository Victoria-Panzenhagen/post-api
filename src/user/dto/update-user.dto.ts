import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome do usuário',
    example: 'Maria Silva',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'maria.silva@email.com',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'novaSenha123',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password?: string;
}
