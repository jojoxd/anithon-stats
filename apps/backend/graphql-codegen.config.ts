import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "",
	documents: [
		"src/domain/graphql/anilist/**/*.gql.ts"
	],
	generates: {
		'./src/domain/graphql/anilist/generated/': {
			preset: 'client',
			plugins: [],
			presetConfig: {
				gqlTagName: 'gql'
			},
		},
	},

	ignoreNoDocuments: true,
};

export default config;
