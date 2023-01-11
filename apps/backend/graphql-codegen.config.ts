import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "https://graphql.anilist.co",
	documents: [
		"src/domain/graphql/anilist/**/*.gql.ts"
	],
	generates: {
		'./src/domain/graphql/anilist/generated-types.ts': {
			plugins: [
				'typescript',
				'typescript-operations'
			],
		},
	},

	ignoreNoDocuments: true,
};

export default config;
