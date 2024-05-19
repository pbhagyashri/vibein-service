type SelectFields = {
	[key: string]: string[];
};

export const SelectFieldsOfRelatedEntity: SelectFields = { author: ['author.email', 'author.username'] };
