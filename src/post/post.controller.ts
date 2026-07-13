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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //● GET /post/search - Busca de Posts:
  //● GET /post - Listagem de Todas as Postagens:

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
    const userId = user?.sub; // Use optional chaining to safely access the sub property
    console.log('User ID:', userId); // Log the user ID for debugging
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar posts', description: 'Listagem de posts.' })
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
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
