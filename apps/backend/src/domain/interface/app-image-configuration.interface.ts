export interface AppImageConfiguration
{
	entry: {
		perRow: number;
		
		width: number;
		height: number;
		margin: number;
	};
	
	text: {
		width: number;
		height: number;
		padding: number;
	},
	
	color: {
		text: string,
		background: string,
	},
	
	fonts: {
		[fontFamily: string]: FontConfig;
	},
	
	font: {
		title: FontDefinition;
		content: FontDefinition;
	},
}

interface FontConfig
{
	path: string;
	style?: string;
	weight?: string;
}

interface FontDefinition
{
	family: string;
	weight: string;
	style?: string;
}