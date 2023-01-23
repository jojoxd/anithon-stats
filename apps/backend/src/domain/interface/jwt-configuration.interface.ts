export interface JwtConfiguration
{
	readonly secret: string;

	readonly issuer: string;

	readonly audience: string;

	readonly maxAgeInSeconds: number;
}