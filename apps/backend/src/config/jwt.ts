import { JwtConfiguration } from "../domain/interface/jwt-configuration.interface";

const jwt: JwtConfiguration = {
	secret: process.env.JWT_SECRET!,

	issuer: process.env.JWT_ISSUER!,
	audience: process.env.JWT_AUDIENCE!,

	maxAgeInSeconds: Number(process.env.JWT_MAX_AGE_IN_SECONDS!),
};

export default jwt;