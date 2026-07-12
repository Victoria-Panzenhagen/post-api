import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar um usuário',
    description: 'Cria um novo usuário.',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiConflictResponse({
    description: 'Já existe um usuário com o mesmo e-mail.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Listagem de usuários.',
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
  findAll(@Query() listUserDto: ListUserDto) {
    return this.userService.findAll(listUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um usuário pelo ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID do usuário' })
  @ApiOkResponse({
    description: 'Usuário encontrado com sucesso.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar um usuário',
    description: 'Atualiza os dados de um usuário existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador do usuário.',
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiConflictResponse({
    description: 'Já existe um usuário com o mesmo e-mail.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiParam({
    name: 'id',
    description: 'Identificador do usuário.',
  })
  @ApiOkResponse({
    description: 'Usuário excluído com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Os dados enviados são inválidos.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor.',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
