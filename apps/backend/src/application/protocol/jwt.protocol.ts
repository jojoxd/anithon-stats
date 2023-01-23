import {Req} from "@tsed/common";
import {OnVerify, Arg, Protocol} from "@tsed/passport";
import {Unauthorized} from "@tsed/exceptions";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {UserEntity} from "../../domain/entity/user/user.entity";
import {UserRepository} from "../../domain/repository/user/user.repository";
import jwtConfig from "../../config/jwt";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

@Protocol({
	name: "jwt",
	useStrategy: JwtStrategy,

	settings: {
		session: false,

		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: jwtConfig.secret,
		issuer: jwtConfig.issuer,
		audience: jwtConfig.audience,
	},
})
export class JwtProtocol implements OnVerify
{
	@InjectRepository(UserEntity)
	protected readonly userRepository!: UserRepository;

	public async $onVerify(@Req() request: Req, @Arg(0) jwtPayload: any): Promise<UserEntity | never>
	{
		const user = await this.userRepository.findOne({
			id: jwtPayload.sub,
		});

		if (!user) {
			throw new Unauthorized("Invalid JWT Token");
		}

		// @ts-ignore TS2339 request.user is actually a thing
		// @TODO: Do we actually require request.user?
		request.user = user;

		return user;
	}
}