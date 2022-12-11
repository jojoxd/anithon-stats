import {GraphQLError} from "graphql";

export class AnilistError extends Error
{
    constructor(message?: string, graphQLErrors?: ReadonlyArray<GraphQLError>)
    {
        super(message);

        this.graphQLErrors = graphQLErrors;
    }

    public readonly graphQLErrors: ReadonlyArray<GraphQLError> | undefined;
}
