import {Constant, Inject, Service} from "@tsed/di";
import {ListEntity} from "../../../entity/list/list.entity";
import {EntryEntity} from "../../../entity";
import {filters, Image, Object as FabricObject, Rect, StaticCanvas, Textbox, util as fabricUtil} from "fabric/node";
import {registerFont} from "canvas";
import {AppImageConfiguration} from "../../../interface/app-image-configuration.interface";
import {ListMetadataDomainService} from "../metadata/list-metadata.domain-service";
import {BeforeListen} from "@tsed/common/lib/types/interfaces/BeforeListen";
import {EntryStatusEnum} from "@anistats/shared";
import {formatTime} from "../../../util/format-time.fn";

const {
	Gamma: GammaFilter,
	Saturation: SaturationFilter,
	Blur: BlurFilter,
} = filters;

type FabricObjectLike = {
	left: number;
	top: number;
	width: number;
	height: number;
};

@Service()
export class ListImageDomainService implements BeforeListen
{
	@Constant("app.image")
	protected imageConfig!: AppImageConfiguration;

	@Inject()
	protected listMetadataService!: ListMetadataDomainService;

	async generateImage(list: ListEntity, embed: boolean = true, withState: boolean = false): Promise<StaticCanvas>
	{
		await list.entries.loadItems();
		await Promise.all([
			list.user.load(),

			...list.entries
				.getItems()
				.map((entry) => entry.series.load()),
		]);

		// @ts-expect-error TS2345: Docs say null is allowed here
		const canvas = new StaticCanvas(null, {
			...this.getImageSize(list),
		});

		const background = new Rect({
			left: 0,
			right: 0,
			...this.getImageSize(list),
			fill: this.imageConfig.color.background,
			stroke: this.imageConfig.color.background,
		});

		canvas.add(background);

		if (embed) {
			this.squircle(background, 10, background);
		}

		canvas.add(...await this.createText(list));

		for(const [index, entry] of list.entries.getItems().entries()) {
			canvas.add(...await this.createEntry(entry, index, withState));
		}

		canvas.renderAll();

		return canvas;
	}

	protected getImageSize(list: ListEntity)
	{
		return {
			width: Math.max(this.imageConfig.text.width, this.imageConfig.entry.margin + this.imageConfig.entry.perRow * (this.imageConfig.entry.width + this.imageConfig.entry.margin)),
			height: this.imageConfig.text.height + this.imageConfig.entry.margin + (Math.ceil(list.entries.count() / this.imageConfig.entry.perRow) * (this.imageConfig.entry.height + this.imageConfig.entry.margin)),
		};
	}

	protected async fetchImage(uri: string): Promise<Image>
	{
		return Image.fromURL(uri);
	}

	protected async createText(list: ListEntity): Promise<FabricObject[]>
	{
		const metadata = await this.listMetadataService.getMetadata(list);

		const title = new Textbox(`${list.user.getEntity().name} / ${metadata.title}`, {
			left: this.imageConfig.text.padding,
			top: this.imageConfig.text.padding,
			width: this.getImageSize(list).width,
			fontSize: 32,

			...this.titleFont,
			...this.textStyle,
		});

		const texts = {
			'Runtime': formatTime({ minutes: metadata.stats.time, }),
		};

		const textboxes = [];
		let top = this.imageConfig.text.padding * 2 + title.height;
		let left = this.imageConfig.text.padding;
		for(const [header, value] of Object.entries(texts)) {
			const titleTextbox = new Textbox(header, {
				top: top,
				left: left,
				fontSize: 18,
				...this.textStyle,
				...this.contentFont,
			});

			const valueTextbox = new Textbox(value.toString(), {
				top: top + titleTextbox.height + 4,
				left: left,
				fontSize: 16,
				...this.textStyle,
				...this.contentFont,
			});

			left = left + Math.max(valueTextbox.width, titleTextbox.width) + this.imageConfig.text.padding;

			textboxes.push(titleTextbox, valueTextbox);
		}

		return [
			title,
			...textboxes,
		];
	}

	protected async createEntry(entry: EntryEntity, index: number, withState: boolean): Promise<FabricObject[]>
	{
		const elements = [];

		const bounds = {
			...this.entryIndexToPosition(index),
			width: this.imageConfig.entry.width,
			height: this.imageConfig.entry.height,
		};

		const image = await this.fetchImage(entry.series.getEntity().coverImage!);
		elements.push(image);

		image
			.set({
				left: bounds.left,
				top: bounds.top,
			})
			.scale(fabricUtil.findScaleToCover(image, bounds));

		this.squircle(image, 10, bounds);

		if (withState) {
			if (entry.state === EntryStatusEnum.Dropped) {
				// @ts-expect-error TS2345: Incorrect typing
				image.filters.push(new GammaFilter({ gamma: [0.4, 0.0, 0.0] }));

				// @ts-expect-error TS2345: Incorrect typing
				image.filters.push(new SaturationFilter({ saturation: 1.1, }));

				// @ts-expect-error TS2345: Incorrect typing
				image.filters.push(new BlurFilter({ blur: 0.25, }));

				image.applyFilters();
			}

			const stateText = new Textbox(this.mapEntryState(entry.state), {
				...this.contentFont,
				...this.textStyle,
				fontSize: 16,
			});

			this.relativePosition(bounds, stateText, { x: -10, y: -10, });

			const stateTextBackground = new Rect({
				left: stateText.left - 4,
				top: stateText.top - 4,
				width: stateText.width + 8,
				height: stateText.height + 8,
				fill: this.imageConfig.color.background,
				stroke: this.imageConfig.color.background,
			});

			this.squircle(stateTextBackground, 5, stateTextBackground);

			elements.push(stateTextBackground, stateText);
		}

		return elements;
	}

	protected squircle(obj: FabricObject, radius = 10, bounds: FabricObjectLike)
	{
		const clipPath = new Rect({
			left: bounds.left,
			top: bounds.top,

			rx: radius,
			ry: radius,

			absolutePositioned: true,

			width: bounds.width,
			height: bounds.height,
		});

		obj.set({
			clipPath,
		});
	}

	protected mapEntryState(state: EntryStatusEnum): string
	{
		const states = {
			[EntryStatusEnum.Completed]: "Completed",
			[EntryStatusEnum.Current]: "Watching",
			[EntryStatusEnum.Dropped]: "Dropped",
			[EntryStatusEnum.Paused]: "Paused",
			[EntryStatusEnum.Planning]: "Planning",
			[EntryStatusEnum.Repeating]: "Watching",
		};

		// Make unknown state be completed.
		return states[state] ?? "Completed";
	}

	get titleFont()
	{
		return {
			fontFamily: this.imageConfig.font.title.family,
			fontWeight: this.imageConfig.font.title.weight ?? '400',
			fontStyle: this.imageConfig.font.title.style ?? 'normal',
		};
	}

	get contentFont()
	{
		return {
			fontFamily: this.imageConfig.font.content.family,
			fontWeight: this.imageConfig.font.content.weight ?? '400',
			fontStyle: this.imageConfig.font.content.style ?? 'normal',
		};
	}

	get textStyle()
	{
		return {
			fill: this.imageConfig.color.text,
		};
	}

	protected entryIndexToPosition(index: number)
	{
		return {
			left: this.imageConfig.entry.margin + ((index % this.imageConfig.entry.perRow) * (this.imageConfig.entry.width + this.imageConfig.entry.margin)),
			top: this.imageConfig.text.height + this.imageConfig.entry.margin + (Math.floor(index / this.imageConfig.entry.perRow) * (this.imageConfig.entry.height + this.imageConfig.entry.margin)),
		};
	}

	protected relativePosition(root: FabricObject | FabricObjectLike, obj: FabricObject, { x, y }: { x: number, y: number, })
	{
		let left = root.left + x;
		let top = root.top + x;

		if (x < 0) {
			left = root.left + root.width + x - obj.width;
		}

		if (y < 0) {
			top = root.top + root.height + y - obj.height;
		}

		obj.left = left;
		obj.top = top;

		obj.setCoords();
	}

	$beforeListen(): void
	{
		this.registerFonts();
	}

	protected registerFonts()
	{
		for(const [family, config] of Object.entries(this.imageConfig.fonts)) {
			registerFont(
				config.path,
				{
					family,
					style: config.style ?? 'normal',
					weight: config.weight ?? '400',
				}
			)
		}
	}
}
