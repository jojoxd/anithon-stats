import { GraphQLError } from "graphql";
export declare class AnilistError extends Error {
    constructor(message?: string, graphQLErrors?: ReadonlyArray<GraphQLError>);
    readonly graphQLErrors: ReadonlyArray<GraphQLError> | undefined;
}
//# sourceMappingURL=AnilistError.d.ts.map