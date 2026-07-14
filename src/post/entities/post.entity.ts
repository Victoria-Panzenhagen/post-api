import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { DisciplineEntity } from '../../discipline/entities/discipline.entity';
import { UserEntity } from '../../user/entities/user.entity';
@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
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

  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @RelationId((post: PostEntity) => post.user)
  userId!: number;
}
