import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	title!: string;

	@Column()
	content!: string;

	@Column({ type: 'int', default: 0 })
	likes!: number;

	@Column()
	creatorId: number;

	@ManyToOne(() => User, (user) => user.posts)
	creator: User;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
