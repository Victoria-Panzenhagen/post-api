import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostResponseDto } from './dto/response/post-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ListPostDto } from './dto/list-post.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar um post',
    description: 'Cria um novo post.',
  })
  @ApiCreatedResponse({
    description: 'Post criado com sucesso.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiConflictResponse({
    description: 'Já existe um post com o mesmo título.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar posts',
    description: 'Retorna todos os posts disponíveis para visualização.',
  })
  @ApiOkResponse({
    type: PaginatedResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  findAll(@Query() listPostDto: ListPostDto) {
    return this.postService.findAll(listPostDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar Minhas Postagens',
    description:
      'Retorna apenas as postagens criadas pelo professor autenticado para gerenciamento.',
  })
  @ApiOkResponse({
    type: PaginatedResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  findAllAdmin(
    @Query() listPostDto: ListPostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postService.findAll(listPostDto, user);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar Posts',
    description:
      'Retorna uma lista de posts cujo título ou conteúdo contenham o termo informado na query string.',
  })
  @ApiOkResponse({
    type: PaginatedResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  findAllSearch(@Query() listPostDto: ListPostDto) {
    return this.postService.findAll(listPostDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um post pelo ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID do post' })
  @ApiOkResponse({
    description: 'Post encontrado com sucesso.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar um post',
    description: 'Atualiza os dados de um post existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador do post.',
  })
  @ApiOkResponse({
    description: 'Post atualizado com sucesso.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiConflictResponse({
    description: 'Já existe um post com o mesmo título.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover um post' })
  @ApiParam({
    name: 'id',
    description: 'Identificador do post.',
  })
  @ApiOkResponse({
    description: 'Post excluido com sucesso.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  @ApiNotFoundResponse({
    description: 'Post não encontrado.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.postService.remove(id, user);
  }
}
