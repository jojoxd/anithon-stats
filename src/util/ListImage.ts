import {Box, CanvasUtil, Point} from "./CanvasUtil";
import {Entry} from "../services/ChunkService/Entry";
import got from "got";
import {ChunkList} from "../dto/ChunkList";
import {MediaListStatus} from "@anime-rss-filter/anilist";

export class ListImage
{
    protected entries: Array<Entry>;

    protected listName: string;

    protected chunks: ChunkList;

    /**
     * @see frontend/src/assets/css/_variables.scss
     */
    protected static readonly BACKGROUND_COLOR = "rgb(11, 22, 34)";

    /**
     * @see frontend/src/assets/css/_variables.scss
     */
    protected static readonly TEXT_COLOR = "rgb(159, 173, 189)";

    constructor(entries: Array<Entry>, chunks: ChunkList, listName: string)
    {
        this.entries = entries;
        this.chunks = chunks;
        this.listName = listName;
    }

    protected async fetchImage(url: string): Promise<Buffer>
    {
        const avaRequest = await got(url, { method: "GET" });

        return Buffer.from(avaRequest.rawBody);
    }

    protected getTotalSequels(entry: Entry): number
    {
        return entry.sequel ? 1 + this.getTotalSequels(entry.sequel) : 0;
    }

    async generate()
    {
        const imageBox: Box = { w: this.entries.length * 100 + 10, h: 150 };
        const textBox: Box = { w: imageBox.w, h: 100 };

        const canvas = new CanvasUtil({
            w: imageBox.w,
            h: imageBox.h + textBox.h,
        });

        // Clear Background so clipRadius composition is correct
        canvas.context.clearRect(0, 0, canvas.size.w, canvas.size.h);

        await canvas.fill.withStyle(ListImage.BACKGROUND_COLOR, async (fill) => {
            await canvas.withRestore(async () => {
                await canvas.clipRadius(5, { x: 0, y: 0, ...canvas.size });

                await fill.rect({
                    x: 0,
                    y: 0,
                    ...canvas.size
                });
            });
        });

        // Render main entries
        await canvas.divide(canvas.size.w, this.entries, 10, async (x, maxSize, entry) => {
            await canvas.withRestore(async (ctx) => {
                await canvas.clipRadius(5, { x, y: textBox.h + 10, w: maxSize, h: imageBox.h - 20 });

                await canvas.withRestore(async () => {
                    // Add a red glow effect if this entry was dropped
                    if(entry!.data.status === MediaListStatus.DROPPED) {
                        ctx.filter = "blur(2px) grayscale(100%)";
                    }

                    await canvas.drawImageCentered(
                        await this.fetchImage(entry!.data.media!.coverImage!.large!),
                        { x: x + (maxSize / 2), y: textBox.h + (imageBox.h / 2) },
                        { w: maxSize, h: imageBox.h - 20 }
                    );
                });

                // Add a red glow effect if this entry was dropped
                if(entry!.data.status === MediaListStatus.DROPPED) {
                    ctx.globalCompositeOperation = "color";

                    await canvas.fill.withStyle("red", async () => {
                        await canvas.fill.rect({
                            x: x,
                            y: textBox.h,
                            w: maxSize,
                            h: imageBox.h
                        });
                    });
                }

                // Draw a sequel badge (+ number) if this entry has sequels
                if(entry!.sequel) {
                    await canvas.fill.withStyle(ListImage.BACKGROUND_COLOR, async (fill) => {
                        const box: Box = { w: 30, h: 20 };

                        await canvas.withRestore(async () => {
                            await canvas.clipRadius(5, {
                                x: x + maxSize - box.w - 5,
                                y: textBox.h + imageBox.h - box.h - 15,
                                ...box
                            });

                            await fill.rect({
                                x: x + maxSize - box.w - 5,
                                y: textBox.h + imageBox.h - box.h - 15,
                                ...box
                            });
                        });

                        await canvas.text(async (text) => {
                            await text.withFont('.65rem Arial', 'rgb(159, 173, 189)', () => {
                                text.write(`+ ${this.getTotalSequels(entry!)}`, {
                                    x: x + maxSize - box.w + 2,
                                    y: textBox.h + imageBox.h - box.h - 1,
                                });
                            });
                        });
                    });
                }
            });
        });

        // Write all text at the top
        await canvas.text(async (text) => {
            await text.withFont('1.5rem Arial', ListImage.TEXT_COLOR, () => {
                text.write('#' + this.listName, { x: 10, y: 40 });
            });

            const textPlaces: Array<Point> = [
                { x: 10, y: 70 },
                { x: 10, y: 90 },
                { x: 110, y: 70 },
                { x: 110, y: 90 },
                { x: 210, y: 70 },
                { x: 210, y: 90 },
            ];

            await text.withFont('.75rem Arial', 'rgb(159, 173, 189)', () => {
                text.write(`${this.entries.length} Serie${this.entries.length > 1 ? 's' : ''}`, textPlaces.shift()!);

                const totalSequels: number = this.entries.reduce((acc, e) => acc + this.getTotalSequels(e), 0);
                if(totalSequels > 0)
                    text.write(`+ ${totalSequels} Sequel${totalSequels > 1 ? 's' : ''}`, textPlaces.shift()!);

                const totalTime = this.entries.reduce((acc, e) => acc + e.totalTime, 0);
                text.write(`${(totalTime / 60).toFixed(0)} Hours`, textPlaces.shift()!);

                text.write(`${this.chunks.weightedProgress.toFixed(1)}% Completed`, textPlaces.shift()!);

                const droppedCount = this.entries.filter((e) => e.data.status === MediaListStatus.DROPPED).length;
                if(droppedCount > 0)
                    text.write(`${droppedCount} Dropped`, textPlaces.shift()!);
            });
        });

        return canvas.toPng();
    }
}