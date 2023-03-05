import {UserRepository} from "../../repository/user/user.repository";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {UserEntity} from "../../entity/user/user.entity";
import {Inject, Service} from "@tsed/di";
import {AnilistUserDomainService} from "../anilist/user/anilist-user.domain-service";
import {UserEntityFactory} from "../../factory/user/user-entity.factory";
import {InternalServerError} from "@tsed/exceptions";
import { $log } from "@tsed/common";
import { AnilistUserView } from "../../view/anilist/user/anilist-user.view";

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

		const userViews = await Promise.all(
			anilistUserViews.map((anilistUserView) => {
				return this.findOrCreateUserByUserView(anilistUserView);
			}),
		);

		await this.userRepository.flush();

		return userViews;
	}

	protected async findOrCreateUserByUserView(anilistUserView: AnilistUserView): Promise<UserEntity>
	{
		let userEntity = await this.userRepository.findOne({ anilistId: anilistUserView.id });

		if (!userEntity) {
			userEntity = UserEntityFactory.createFromAnilistUser(anilistUserView);

			$log.info(`Creating user entity for ${anilistUserView.userName} (${anilistUserView.id}) due to search`, { uid: userEntity.id, });

			this.userRepository.persist(userEntity);
		}

		return userEntity;
	}
}
