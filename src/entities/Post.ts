import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { User, Like } from './';

@Entity()
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	title!: string;

	@Column()
	content!: string;

	@Column({ type: 'int' })
	authorId!: string;

	@ManyToOne(() => User)
	author: User;

	@ManyToMany(() => Like, (like) => like.posts)
	@JoinTable()
	likes: Like[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
