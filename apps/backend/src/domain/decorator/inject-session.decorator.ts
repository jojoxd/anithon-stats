import {getContext, injectProperty} from "@tsed/di";
import {Context} from "@tsed/common";

/**
 * Inject the session into a service
 *
 * @TODO: Move to new package: @jojoxd/tsed-util/session
 *
 * @NOTE: You most likely want to be in the {@see ProviderScope.REQUEST} scope
 *
 * ```typescript
 * @Injectable({ scope: ProviderScope.REQUEST, })
 * export class MyService {
 *     @InjectSession()
 *     session?: Session;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 */
export function InjectSession(): PropertyDecorator
{
	// @ts-ignore This is the same as in TsED
	return (target: any, propertyKey: string): any | void => {
		injectProperty(target, propertyKey, {
			resolver() {
				return () => {
					const context: Context | undefined = getContext();

					return context?.getRequest()?.session;
				};
			},
		});
	};
}

export {Session} from "@tsed/common";
