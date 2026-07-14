import { Module } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { DisciplineController } from './discipline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplineEntity } from './entities/discipline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DisciplineEntity])],
  providers: [DisciplineService],
  controllers: [DisciplineController],
})
export class DisciplineModule {}
