import {Service, Constant} from "@tsed/di";
import {UserEntity} from "../../entity";
import * as jwt from "jsonwebtoken";
import {JwtConfiguration} from "../../interface/jwt-configuration.interface";

@Service()
export class JwtDomainService
{
	@Constant("jwt")
	protected readonly config!: JwtConfiguration;

	public async createToken(user: UserEntity): Promise<string>
	{
		const now = Date.now();

		return jwt.sign({
			iss: this.config.issuer,
			aud: this.config.audience,
			sub: user.id,
			exp: now + this.config.maxAgeInSeconds * 1000,
			iat: now,
		}, this.config.secret);
	}
}
