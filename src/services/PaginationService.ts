import { Cursor, PaginationReqestParams, PaginationResponse } from '@/types';
import { MainEntity } from './types';
import { AppDataSource } from '../index';
import { SelectFieldsOfRelatedEntity } from './Constants';

type PaginationServiceArgs = {
	cursor: Cursor;
	limit: number;
	mainEntity: MainEntity;
	relation?: string;
	authorId?: string;
};

export class PaginationService<T> {
	private limit: number;
	private cursor: Cursor;
	private maxLimit: number;
	private mainEntity: MainEntity;
	private relation?: string;
	private authorId?: string;

	constructor({ cursor, limit, mainEntity, relation, authorId }: PaginationServiceArgs) {
		this.cursor = cursor;
		this.limit = limit;
		this.maxLimit = this.limit + 1;
		this.mainEntity = mainEntity;
		this.relation = relation;
		this.authorId = authorId;
	}

	async hasPreviousPage(): Promise<boolean> {
		const respository = AppDataSource?.getRepository(this.mainEntity);
		const qb = respository.createQueryBuilder(this.mainEntity);

		return await qb.orderBy('createdAt', 'ASC').limit(1).getExists();
	}

	async getFirstPage(): Promise<T[]> {
		const respository = AppDataSource?.getRepository(this.mainEntity);
		let qb = respository.createQueryBuilder(this.mainEntity);
		console.log('this.authorId', this.authorId);
		if (this.authorId) {
			qb = qb.where(`${this.mainEntity}.authorId = :authorId`, { authorId: this.authorId });
		}

		if (this.relation) {
			qb = qb.select([`${this.mainEntity}`, ...SelectFieldsOfRelatedEntity[this.relation]]);
			qb = qb.leftJoin(`${this.mainEntity}.${this.relation}`, `${this.relation}`);
		}

		const posts = await qb.orderBy(`${this.mainEntity}.createdAt`, 'ASC').limit(this.maxLimit).getMany();

		return posts as T[];
	}

	async hasNextPage(records: T[]): Promise<boolean> {
		return records.length > this.limit;
	}

	async getPage(): Promise<T[]> {
		const { createdAt, id } = this.cursor;
		console.log({ createdAt, id });
		const respository = AppDataSource?.getRepository(this.mainEntity);
		let qb = respository
			.createQueryBuilder(this.mainEntity)
			.where(`${this.mainEntity}.createdAt < :createdAt`, { createdAt });

		if (this.authorId) {
			qb = qb.andWhere(`${this.mainEntity}.authorId = :authorId`, { authorId: this.authorId });
		}

		if (this.relation) {
			qb = qb.select([`${this.mainEntity}`, ...SelectFieldsOfRelatedEntity[this.relation]]);
			qb = qb.leftJoin(`${this.mainEntity}.${this.relation}`, `${this.relation}`);
		}

		try {
			const records = await qb.orderBy(`${this.mainEntity}.createdAt`, 'ASC').limit(this.maxLimit).getMany();

			return records as T[];
		} catch (error) {
			throw new Error('Could not get records');
		}
	}

	async getPaginatedRecords({ cursor }: PaginationReqestParams): Promise<PaginationResponse<T>> {
		try {
			if (!cursor) {
				const records = await this.getFirstPage();

				return {
					records: records.slice(0, this.limit) as T[],
					hasNextPage: await this.hasNextPage(records),
					hasPreviousPage: false,
				};
			}

			const records = await this.getPage();

			return {
				records: records.slice(0, this.limit),
				hasNextPage: await this.hasNextPage(records),
				hasPreviousPage: await this.hasPreviousPage(),
			};
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
