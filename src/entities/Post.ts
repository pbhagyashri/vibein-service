import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	title!: string;

	@Column()
	content!: string;

	@Column({ type: 'int', default: 0 })
	likes!: number;

	@Column({ type: 'int' })
	authorId!: string;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: 'authorId' })
	user: User;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
