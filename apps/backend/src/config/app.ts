import {AppConfiguration} from "../domain/interface/app-configuration.interface";

const AppConfig: AppConfiguration = {
	series: {
		syncTimeout: { day: 1 }
	},

	image: {
		entry: {
			perRow: 5,
			width: 100 * 2,
			height: 140 * 2,

			margin: 16 * 2,
		},

		text: {
			width: 512,
			height: 128,

			padding: 16,
		},

		color: {
			text: 'rgb(159, 173, 189)',
			background: 'rgb(11, 22, 34)',
		},

		fonts: {
			'Roboto-400': {
				path: require.resolve('@fontsource/roboto/files/roboto-all-400-normal.woff'),
				style: 'normal',
				weight: '400'
			},
			'Roboto-700': {
				path: require.resolve('@fontsource/roboto/files/roboto-all-700-normal.woff'),
				style: 'normal',
				weight: '700',
			},
		},

		font: {
			title: {
				family: 'Roboto-700',
				style: 'normal',
				weight: '700',
			},

			content: {
				family: 'Roboto-400',
				style: 'normal',
				weight: '400',
			},
		},
	},
};

export default AppConfig;