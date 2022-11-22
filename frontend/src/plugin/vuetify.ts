import { createVuetify } from "vuetify";
import {md2} from "vuetify/blueprints";
import 'vuetify/styles';
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

export default createVuetify({
	blueprint: md2,

	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
});
