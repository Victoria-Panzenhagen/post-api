import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostResponseDto } from './dto/response/post-response.dto';
import { ListPostDto } from './dto/list-post.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
    @InjectRepository(DisciplineEntity)
    private readonly disciplineRepository: Repository<DisciplineEntity>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: JwtPayload,
  ): Promise<PostResponseDto> {
    const postExistente = await this.repository.findOne({
      where: { title: createPostDto.title },
    });

    if (postExistente) {
      throw new ConflictException(
        `O título ${createPostDto.title} já está em uso.`,
      );
    }

    const discipline = await this.disciplineRepository.findOneBy({
      id: createPostDto.disciplineId,
    });

    if (!discipline) {
      throw new NotFoundException('Disciplina não encontrada.');
    }

    const post = this.repository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      discipline,
      user: { id: user.sub },
    });

    const createdPost = await this.repository.save(post);

    return new PostResponseDto(createdPost);
  }

  async findAll(
    listPostDto: ListPostDto,
    user?: JwtPayload,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const page = listPostDto.page ?? 1;
    const limit = listPostDto.limit ?? 10;
    const userId = user?.sub ?? null;
    const search = listPostDto.search;

    const query = this.repository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.discipline', 'discipline')
      .innerJoin('post.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    if (search) {
      query.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [posts, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: posts.map((post) => new PostResponseDto(post)),
    };
  }

  async findOne(id: number): Promise<PostResponseDto> {
    const post = await this.repository.findOne({
      where: { id },
      relations: {
        discipline: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    return new PostResponseDto(post);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    user: JwtPayload,
  ): Promise<PostResponseDto> {
    const post = await this.repository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    if (post.userId !== user.sub) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este post.',
      );
    }

    const postExistente = await this.repository.findOne({
      where: { title: updatePostDto.title, id: Not(id) },
    });

    if (postExistente) {
      throw new ConflictException(
        `O título ${updatePostDto.title} já está em uso.`,
      );
    }

    const discipline = await this.disciplineRepository.findOneBy({
      id: updatePostDto.disciplineId,
    });

    if (!discipline) {
      throw new NotFoundException('Disciplina não encontrada.');
    }

    Object.assign(post, {
      title: updatePostDto.title,
      content: updatePostDto.content,
      discipline,
    });

    const updatedPost = await this.repository.save(post);

    return new PostResponseDto(updatedPost);
  }

  async remove(id: number, user: JwtPayload): Promise<void> {
    const post = await this.repository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    if (post.userId !== user.sub) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este post.',
      );
    }

    await this.repository.softDelete(id);
  }
}
