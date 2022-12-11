export interface UserDataDto
{
	readonly uuid: string;

	readonly anilistId: number;

	readonly name: string;

	readonly avatar: string;

	readonly isCurrentUser: boolean;
}
