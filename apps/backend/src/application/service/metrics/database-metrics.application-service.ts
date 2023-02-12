import { AfterInit } from "@tsed/common";
import { Inject, Service } from "@tsed/di";
import { MetricService } from "@jojoxd/tsed-util/prometheus";
import { InjectRepository } from "@jojoxd/tsed-util/mikro-orm";
import { BaseEntityRepository } from "../../../domain/repository/base-entity.repository";
import { UserRepository } from "../../../domain/repository/user/user.repository";
import { EntryRepository } from "../../../domain/repository/entry/entry.repository";
import { ListRepository } from "../../../domain/repository/list/list.repository";
import { SeriesRepository } from "../../../domain/repository/series/series.repository";
import { UserEntity } from "../../../domain/entity/user/user.entity";
import { EntryEntity } from "../../../domain/entity/entry/entry.entity";
import { ListEntity } from "../../../domain/entity/list/list.entity";
import { SeriesEntity } from "../../../domain/entity/series/series.entity";

@Service()
export class DatabaseMetricsApplicationService implements AfterInit
{
	@Inject()
	protected readonly metricService!: MetricService;

	@InjectRepository(SeriesEntity)
	protected readonly seriesRepository!: SeriesRepository;

	@InjectRepository(EntryEntity)
	protected readonly entryRepository!: EntryRepository;

	@InjectRepository(ListEntity)
	protected readonly listRepository!: ListRepository;

	@InjectRepository(UserEntity)
	protected readonly userRepository!: UserRepository;

	$afterInit(): void
	{
		this.createGauge("series", () => this.seriesRepository);
		this.createGauge("entries", () => this.entryRepository);
		this.createGauge("lists", () => this.listRepository);
		this.createGauge("users", () => this.userRepository);
	}

	createGauge<T extends object>(entityName: string, getRepository: () => BaseEntityRepository<T>)
	{
		return this.metricService.createGauge({
			name: `db_total_${entityName}`,
			help: `Total Count of ${entityName} Entities`,

			async collect() {
				const count = await getRepository().count();

				this.set(count);
			},
		});
	}
}