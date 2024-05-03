import { Post, User } from './';
import { BaseEntity, Entity, ManyToOne, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Like extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ nullable: false })
	userId!: string;

	@ManyToMany(() => Post, (post) => post.likes)
	@JoinTable()
	posts: Post[];

	@ManyToOne(() => User, (user) => user.likes)
	user: User;
}
