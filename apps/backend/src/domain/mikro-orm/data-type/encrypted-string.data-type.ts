import {TextType, Platform} from "@mikro-orm/core";
import {TransformContext} from "@mikro-orm/core/types/Type";
import * as crypto from "crypto";
import {DIContext, getContext} from "@tsed/di";

type ValueType<T> = T | null | undefined;

export class EncryptedStringDataType extends TextType
{
	protected get key(): string
	{
//		const context = getContext() as DIContext;
//
//		return context.injector.get<string>('ENCRYPTION_KEY')!;

		// @NOTE: I'd rather this go through the injector
		return process.env.ENCRYPTION_KEY!;
	}

	public override convertToDatabaseValue(value: ValueType<string>, platform: Platform, context?: TransformContext | boolean): ValueType<string>
	{
		const iv = crypto.randomBytes(12);

		const cipher = crypto.createCipheriv('chacha20-poly1305', this.key, iv);

		if (typeof value === 'string') {
			value = cipher.update(value, 'utf-8', 'hex') + cipher.final('hex') + `;${iv}`;
		}

		return super.convertToDatabaseValue(value, platform, context);
	}

	public override convertToJSValue(value: ValueType<string>, platform: Platform): ValueType<string>
	{
		if (typeof value === 'string') {
			let iv;
			[value, iv] = value.split(';');

			const decipher = crypto.createDecipheriv('chacha20-poly1305', this.key, iv!);

			value = decipher.update(value!, 'hex', 'utf-8') + decipher.final('utf-8');
		}

		return super.convertToJSValue(value, platform);
	}
}
