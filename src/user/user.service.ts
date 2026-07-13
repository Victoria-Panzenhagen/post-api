import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PasswordService } from '../common/security/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const email = createUserDto.email;
    const userExistente = await this.repository.findOne({
      where: { email },
    });

    if (userExistente) {
      throw new ConflictException(`O e-mail ${email} já está em uso.`);
    }

    const passwordHash = await this.passwordService.hash(
      createUserDto.password,
    );

    const user = this.repository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash,
    });

    const createdUser = await this.repository.save(user);

    return new UserResponseDto(createdUser);
  }

  async findAll(
    listUserDto: ListUserDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const page = listUserDto.page ?? 1;
    const limit = listUserDto.limit ?? 10;
    const search = listUserDto.search;
    let filtro = {};

    if (search) {
      filtro = [
        { name: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ];
    }

    const [users, total] = await this.repository.findAndCount({
      where: filtro,
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
      data: users.map((user) => new UserResponseDto(user)),
    };
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return new UserResponseDto(user);
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const email = updateUserDto.email;
    if (email) {
      const userExistente = await this.repository.findOne({
        where: { email, id: Not(id) },
      });

      if (userExistente) {
        throw new ConflictException(`O e-mail ${email} já está em uso.`);
      }
    }

    const passwordHash = updateUserDto.password
      ? await this.passwordService.hash(updateUserDto.password)
      : undefined;

    const updateData: Partial<UserEntity> = {};

    if (updateUserDto.name !== undefined) {
      updateData.name = updateUserDto.name;
    }

    if (updateUserDto.email !== undefined) {
      updateData.email = updateUserDto.email;
    }

    if (passwordHash) {
      updateData.passwordHash = passwordHash;
    }

    Object.assign(user, updateData);

    const updatedUser = await this.repository.save(user);

    return new UserResponseDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.repository.softDelete(id);
  }
}
