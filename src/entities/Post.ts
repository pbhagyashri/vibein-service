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
	text!: string;

	@Column({ type: 'int', default: 0 })
	points!: number;

	@Column()
	creatorId: number;

	@ManyToOne(() => User, (user) => user.posts)
	creator: User;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
