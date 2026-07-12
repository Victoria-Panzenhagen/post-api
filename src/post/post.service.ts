import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostResponseDto } from './dto/response/post-response.dto';
import { ListPostDto } from './dto/list-post.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
    @InjectRepository(DisciplineEntity)
    private readonly disciplineRepository: Repository<DisciplineEntity>,
  ) { }

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
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
    });

    const createdPost = await this.repository.save(post);

    return new PostResponseDto(createdPost);
  }

  async findAll(
    listPostDto: ListPostDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const page = listPostDto.page ?? 1;
    const limit = listPostDto.limit ?? 10;
    const search = listPostDto.search;
    let filtro = {};

    if (search) {
      filtro = [
        { title: ILike(`%${search}%`) },
        { content: ILike(`%${search}%`) },
      ];
    }

    const [posts, total] = await this.repository.findAndCount({
      where: filtro,
      relations: {
        discipline: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

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
  ): Promise<PostResponseDto> {
    const post = await this.repository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
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

  async remove(id: number): Promise<void> {
    const post = await this.repository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
