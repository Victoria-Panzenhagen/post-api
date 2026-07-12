import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListPostDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Número da página.',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Quantidade de registros por página.',
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({
    description: 'Busca por título ou conteúdo.',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
