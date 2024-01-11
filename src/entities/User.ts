import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import { Post } from './Post';

@Entity('author')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ unique: true })
	username!: string;

	@Column()
	password!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	refreshToken!: string;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
