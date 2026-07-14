import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostEntity } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplineEntity } from '../discipline/entities/discipline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, DisciplineEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
