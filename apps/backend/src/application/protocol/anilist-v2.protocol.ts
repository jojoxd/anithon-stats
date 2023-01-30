import {Protocol, OnVerify, Arg} from "@tsed/passport";
import { Inject } from "@tsed/di";
import { AnilistV2Strategy, AnilistV2StrategyOptions } from "../strategy/anilist-v2.strategy";
import { UserDomainService } from "../../domain/service/user/user.domain-service";
import { JwtDomainService } from "../../domain/service/auth/jwt.domain-service";
import { UserRepository } from "../../domain/repository/user/user.repository";
import { AnilistUserId } from "@anistats/shared";
import { decode } from "jsonwebtoken";
import {Unauthorized} from "@tsed/exceptions";
import {AnilistUserDomainService} from "../../domain/service/anilist/user/anilist-user.domain-service";
import { UserEntity } from "../../domain/entity/user/user.entity";
import { InjectRepository } from "@jojoxd/tsed-util/mikro-orm";

@Protocol<AnilistV2StrategyOptions>({
	name: "anilist",
	useStrategy: AnilistV2Strategy,

	settings: {
		clientId: process.env.ANILIST_CLIENT_ID!,
		clientSecret: process.env.ANILIST_CLIENT_SECRET!,
		redirectUri: `${process.env.EXTERNAL_API_URL}/auth/login`,

		headers: {
			"User-Agent": "Test/1.23 (Testing; test/1.23)",
		}
	}
})
export class AnilistV2Protocol implements OnVerify
{
	@Inject()
	protected userService!: UserDomainService;

	@Inject()
	protected anilistUserService!: AnilistUserDomainService;

	@Inject()
	protected jwtService!: JwtDomainService;

	@InjectRepository(UserEntity)
	protected userRepository!: UserRepository;

	async $onVerify(@Arg(0) token: string): Promise<any>
	{
		const anilistId = this.extractId(token);

		if (!anilistId) {
			throw new Unauthorized("Could not extract sub from Anilist JWT Token");
		}

		const anilistUser = await this.anilistUserService.getUser(anilistId);

		if (!anilistUser) {
			throw new Unauthorized("Could not get user from userId");
		}

		// Start onboarding process
		const user = await this.userService.onboardAnilistUser(anilistUser);

		user.anilistToken = token;

		// Ensure the token is saved right now
		await this.userRepository.persistAndFlush(user);

		// @TODO: Save token to database

		if (!user) {
			throw new Unauthorized("Failed to onboard user");
		}

		const localToken = await this.jwtService.createToken(user);

		return { localToken, };
	}

	protected extractId(token: string): AnilistUserId | null
	{
		return decode(token)?.sub ?? null;
	}
}
