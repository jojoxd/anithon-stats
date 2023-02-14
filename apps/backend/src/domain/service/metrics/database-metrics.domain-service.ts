import { AfterInit } from "@tsed/common";
import { Inject, Injectable, ProviderScope } from "@tsed/di";
import { MetricService } from "@jojoxd/tsed-util/prometheus";
import { InjectRepository } from "@jojoxd/tsed-util/mikro-orm";
import { BaseEntityRepository } from "../../repository/base-entity.repository";
import { UserRepository } from "../../repository/user/user.repository";
import { EntryRepository } from "../../repository/entry/entry.repository";
import { ListRepository } from "../../repository/list/list.repository";
import { SeriesRepository } from "../../repository/series/series.repository";
import { UserEntity } from "../../entity/user/user.entity";
import { EntryEntity } from "../../entity/entry/entry.entity";
import { ListEntity } from "../../entity/list/list.entity";
import { SeriesEntity } from "../../entity/series/series.entity";
import { Gauge } from "prom-client";

@Injectable({ scope: ProviderScope.SINGLETON, })
export class DatabaseMetricsDomainService implements AfterInit
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

	public $afterInit(): void
	{
		this.createGauge("series", () => this.seriesRepository);
		this.createGauge("entries", () => this.entryRepository);
		this.createGauge("lists", () => this.listRepository);
		this.createGauge("users", () => this.userRepository);
	}

	protected createGauge<T extends object>(entityName: string, getRepository: () => BaseEntityRepository<T>): Gauge
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