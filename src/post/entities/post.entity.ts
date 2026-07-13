import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DisciplineEntity } from '../../discipline/entities/discipline.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @Column()
  content!: string;

  @ManyToOne(() => DisciplineEntity, { nullable: false })
  @JoinColumn({ name: 'discipline_id' })
  discipline!: DisciplineEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'author_id' })
  author!: UserEntity;
}
