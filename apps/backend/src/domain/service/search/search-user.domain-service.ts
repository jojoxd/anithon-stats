import {UserRepository} from "../../repository/user/user.repository";
import {InjectRepository} from "../../../ext/mikro-orm/inject-repository.decorator";
import {UserEntity} from "../../entity/user/user.entity";
import {Inject, Service} from "@tsed/di";
import {AnilistUserDomainService} from "../anilist/user/anilist-user.domain-service";
import {AnilistUserView} from "../../view/anilist/anilist-user.view";
import {UserEntityFactory} from "../../factory/user/user-entity.factory";
import {InternalServerError} from "@tsed/exceptions";

@Service()
export class SearchUserDomainService
{
	@InjectRepository(UserEntity)
	protected userRepository!: UserRepository;

	@Inject()
	protected anilistUserService!: AnilistUserDomainService;

	public async searchUsers(query: string): Promise<Array<UserEntity>>
	{
		const anilistUserViews = await this.anilistUserService.searchUsers(query);

		if (!anilistUserViews) {
			throw new InternalServerError("Could not load users from anilist");
		}

		return Promise.all(
			anilistUserViews.map((anilistUserView) => {
				return this.findOrCreateUserByUserView(anilistUserView);
			}),
		);
	}

	protected async findOrCreateUserByUserView(anilistUserView: AnilistUserView): Promise<UserEntity>
	{
		let userEntity = await this.userRepository.findOne({ anilistId: anilistUserView.id });

		if (!userEntity) {
			userEntity = UserEntityFactory.createFromAnilistUser(anilistUserView);

			this.userRepository.persist(userEntity);
		}

		return userEntity;
	}
}
