import { createVuetify } from "vuetify";
import {md2} from "vuetify/blueprints";
import 'vuetify/styles';
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

let test: any = {};
test['background-color'] = "rgb(11, 22, 34)";
test['text-color'] = "rgb(159, 173, 189)";
test['foreground-color'] = "rgb(21, 31, 46)";
test['link-text-color'] = "rgb(61,180,242)";


export default createVuetify({
	blueprint: md2,

	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},

	theme: {
		themes: {
			'anilist-like': {
				dark: true,

				colors: {
					background: '#0B1622', // rgb(11, 22, 34)
					'on-background': '#9FADBD',

					surface: '#151F2E',
					'on-surface': '#9FADBD',

					primary: '#9FADBD', // rgb(61,180,242)
					// 'on-primary': '#FF00FF',

					// secondary: '',
					// 'on-secondary': '#FF00FF',

					info: '#3DB4F2',
					// 'on-info': '#FF00FF',

					// success: '#FF00FF',
					// 'on-success': '#FF00FF',

					// warning: '#FF00FF',
					// 'on-warning': '#FF00FF',

					// 'on-error': '#FF00FF',
					// error: '#FF00FF',
				},
			},
		},

		defaultTheme: 'anilist-like',
	}
});
