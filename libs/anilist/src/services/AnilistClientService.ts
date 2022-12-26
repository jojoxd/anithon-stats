import {InjectContext, Service} from "@tsed/di";
import {ApolloClient, DocumentNode} from "apollo-boost";
import {$log, Constant, Inject, PlatformContext} from "@tsed/common";
import {Env} from "@tsed/core";
import {PlatformCache} from "@tsed/platform-cache";
import {ApolloClientBuilder} from "../lib/ApolloClientBuilder";
import {GraphQLError} from "graphql";
import {AnilistError} from "@anistats/anilist";
import {createHash} from "crypto";
import {Mutexes} from "../lib/MutexManager";

@Service()
export class AnilistClientService
{
    public static readonly ENDPOINT = "https://graphql.anilist.co";

    protected apollo: ApolloClient<any>;

    @Constant("env")
    protected env!: Env;

    @InjectContext()
    protected $ctx?: PlatformContext;

    @Inject()
    protected cache!: PlatformCache;

    constructor()
    {
        const builder = new ApolloClientBuilder(AnilistClientService.ENDPOINT);
        builder.withAuth(() => this.token);
        this.apollo = builder.build();
    }

    public get token(): string | null
    {
        try {
            return this.$ctx?.getRequest?.()?.session?.anilist_token ?? null;
        } catch(e) {
            $log.warn(e);

            return null;
        }
    }

    protected createError(errors: ReadonlyArray<GraphQLError>)
    {
        const errorMessage = errors.map((e: GraphQLError) => `GraphQLError/${e.name}: ${e.message}`).join("\n");
        return new AnilistError(errorMessage, errors);
    }

    protected hashObject(namespace: string, obj: any): string
    {
        const hash = createHash('md5')
            .update(JSON.stringify(obj))
            .digest('hex');

        return `${namespace}:${hash}`;
    }

    public async query<T, Q, S = T>(settings: { query: DocumentNode, variables?: Q, key: string, hash?: any, ttl?: number, convert?: (val: T) => S }): Promise<S> | never
    {
        const queryFn = async () => {
            try {
                const {data, errors} = await this.apollo.query<T, Q>({
                    query: settings.query,
                    variables: settings.variables,

                    fetchPolicy: "network-only",
                    errorPolicy: "ignore"
                });

                if (errors) {
                    $log.error(data);
                    throw this.createError(errors!);
                }

                if (settings.convert) {
                    return settings.convert(data);
                }

                return data as unknown as S;
            } catch(e) {
                $log.error(e);
                throw e;
            }
        };

        if (settings.variables ?? settings.hash) {
            // Can use a cache key
            const cacheKey = this.hashObject(settings.key, settings.variables ?? settings.hash);

            const mut = Mutexes.getMutex(cacheKey);

            return mut.runExclusive(async () => {
                return this.cache.wrap(cacheKey, () => {
                    return queryFn();
                }, settings.ttl ?? 30);
            });
        }

        return queryFn();
    }

    public async mutate<T, Q, S = T>(settings: { mutation: DocumentNode, variables?: Q, convert?: (val: T | null | undefined) => S | null | undefined }): Promise<S | null | undefined> | never
    {
        try {
            const {data, errors} = await this.apollo.mutate<T, Q>({
                mutation: settings.mutation,
                variables: settings.variables,

                fetchPolicy: "no-cache",
                errorPolicy: "ignore",
            });

            if(errors) {
                throw this.createError(errors!);
            }

            if (settings.convert) {
                return settings.convert(data);
            }

            return data as unknown as S;
        } catch(e) {
            $log.error(e);
            throw e;
        }
    }
}