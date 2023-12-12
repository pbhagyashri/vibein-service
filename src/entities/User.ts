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

@Entity('user-entity')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	username!: string;

	@Column()
	password!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	refreshToken!: string;

	@OneToMany(() => Post, (post) => post.creator)
	posts: Post[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
