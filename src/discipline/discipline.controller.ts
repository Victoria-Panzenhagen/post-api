import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DisciplineService } from './discipline.service';
import { DisciplineResponseDto } from './dto/response/discipline-response.dto';

@ApiTags('Discipline')
@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar disciplinas',
    description: 'Listagem de disciplinas.',
  })
  @ApiOkResponse({
    type: DisciplineResponseDto,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  findAll(@Query('name') name?: string) {
    return this.disciplineService.findAll(name);
  }
}
