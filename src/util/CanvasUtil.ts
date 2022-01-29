import {Canvas, CanvasRenderingContext2D, Image, loadImage} from "skia-canvas";

export interface CanvasUtilOptions extends Box
{
    type?: 'pdf'|'svg';
}

export interface Point
{
    x: number;
    y: number;
}

export interface Box
{
    w: number;
    h: number;
}

export class CanvasUtil
{
    protected canvas: Canvas;

    constructor(options?: CanvasUtilOptions | Canvas)
    {
        if(options instanceof Canvas) {
            this.canvas = options;
        } else if(options) {
            this.canvas = new Canvas(options.w, options.h);
        }
    }

    get size(): Box
    {
        return {
            w: this.canvas.width,
            h: this.canvas.height
        };
    }

    protected _context: CanvasRenderingContext2D;
    public get context(): CanvasRenderingContext2D
    {
        return this._context ?? this.canvas.getContext("2d");
    }

    public get fill(): CanvasFillUtil
    {
        return new CanvasFillUtil(this);
    }

    async withContext(cb: (ctx: CanvasRenderingContext2D) => Promise<void> | void): Promise<this>
    {
        await cb(this.context);

        return this;
    }

    async withRestore(cb: (ctx: CanvasRenderingContext2D) => Promise<void> | void): Promise<this>
    {
        this.context.save();

        await cb(this.context);

        this.context.restore();

        return this;
    }

    async text(cb: (text: CanvasTextUtil) => Promise<void> | void): Promise<this>
    {
        await cb(new CanvasTextUtil(this));

        return this;
    }

    public async rotateAndExecute(p: Point, angle: number, cb: () => Promise<void> | void): Promise<this>
    {
        await this.withRestore(async (ctx) => {
            ctx.translate(p.x, p.y);
            ctx.rotate(angle);

            await cb();

            ctx.translate(-p.x, -p.y);
        });

        return this;
    }

    /**
     * Usage: canvas.divide(100, 5, 10, async (p) => { await canvas.<anything> });
     */
    public async divide<T>(
        range: number,
        div: number | Array<T>,
        margin: number = 0,
        func: (p: number, maxSize: number, data?: T) => Promise<void> | void
    ): Promise<void> {
        const totalRange = range - margin;

        if(Array.isArray(div)) {
            let step = (totalRange / div.length) - margin;
            let point = margin;

            for(const item of div) {
                await func(point, step, item);

                point += step + margin;
            }
        } else {
            let step = (totalRange / div) - margin;

            for(let point = margin; point > (range - margin); point += step + margin) {
                await func(point, step);
            }
        }
    }

    public async path(cb: (ctx: CanvasRenderingContext2D) => Promise<void> | void, clip: boolean = false): Promise<this>
    {
        const ctx = this.context;

        ctx.beginPath();

        cb(ctx);

        ctx.closePath();

        if(clip)
            ctx.clip();

        return this;
    }

    async clipRadius(radius: number, size: Box & Point)
    {
        await this.clipPath((ctx) => {
            ctx.moveTo(size.x + radius, size.y);
            ctx.lineTo(size.x + size.w - radius, size.y);
            ctx.quadraticCurveTo(size.x + size.w, size.y, size.x + size.w, size.y + radius);
            ctx.lineTo(size.x + size.w, size.y + size.h - radius);
            ctx.quadraticCurveTo(size.x + size.w, size.y + size.h, size.x + size.w - radius, size.y + size.h);
            ctx.lineTo(size.x + radius, size.y + size.h);
            ctx.quadraticCurveTo(size.x, size.y + size.h, size.x, size.y + size.h - radius);
            ctx.lineTo(size.x, size.y + radius);
            ctx.quadraticCurveTo(size.x, size.y, size.x + radius, size.y);
        });
    }

    public async clipPath(cb: (ctx: CanvasRenderingContext2D) => Promise<void> | void): Promise<this>
    {
        return this.path(cb, true);
    }

    public async drawImageCentered(buffer: Buffer | Image, p: Point, b: Box): Promise<this>
    {
        const ctx = this.context;

        let img: Image;
        if(buffer instanceof Buffer) {
            img = await loadImage(buffer);
        } else {
            img = buffer;
        }

        ctx.drawImage(img, p.x - b.w / 2, p.y - b.h / 2, b.w, b.h);

        return this;
    }

    public get toBuffer(): Canvas['toBuffer']
    {
        return this.canvas.toBuffer.bind(this.canvas);
    }

    public toPng(): Buffer
    {
        return this.toBuffer('image/png');
    }
}

class CanvasTextUtil
{
    protected canvas: CanvasUtil;

    constructor(canvas: CanvasUtil)
    {
        this.canvas = canvas;
    }

    async withFont(font: string, color: string, cb: (text: CanvasTextUtil) => Promise<void> | void): Promise<this>
    {
        const ctx = this.canvas.context;

        let origFillStyle = ctx.fillStyle;
        let origFont = ctx.font;

        ctx.fillStyle = color;
        ctx.font = font;

        await cb(this);

        ctx.fillStyle = origFillStyle;
        ctx.font = origFont;

        return this;
    }

    async withColor(color: CanvasRenderingContext2D["fillStyle"], func: (text: this) => Promise<void> | void): Promise<this>
    {
        await this.canvas.fill.withStyle(color, async (ctx) => {
            await func(this);
        });

        return this;
    }

    centered(text: string, pos: Point)
    {
        let ctx = this.canvas.context;
        let metric = ctx.measureText(text);

        pos.x = pos.x - (metric.width / 2);

        ctx.fillText(text, pos.x, pos.y);
    }

    write(text: string, pos: Point)
    {
        let ctx = this.canvas.context;

        ctx.fillText(text, pos.x, pos.y);
    }
}

class CanvasFillUtil
{
    protected canvas: CanvasUtil;

    constructor(canvas: CanvasUtil)
    {
        this.canvas = canvas;
    }

    async withStyle(style: CanvasRenderingContext2D["fillStyle"], fn: (ctx: this) => Promise<void> | void): Promise<void>
    {
        const ctx = this.canvas.context;

        const oldStyle = ctx.fillStyle;
        ctx.fillStyle = style;

        await fn(this);

        ctx.fillStyle = oldStyle;
    }

    async rect(r: Point & Box)
    {
        const ctx = this.canvas.context;

        ctx.fillRect(r.x, r.y, r.w, r.h);
    }
}