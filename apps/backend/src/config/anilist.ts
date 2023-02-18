import { $log } from "@tsed/common";
import {AnilistConfiguration} from "../domain/interface/anilist-configuration.interface";

const anilistConfiguration: AnilistConfiguration = {
	safeMode: !!process.env.ANILIST_SAFE_MODE,
};

if (anilistConfiguration.safeMode) {
	$log.info('[ANILIST] Safe Mode is enabled, will not run any mutation!');
}

export default anilistConfiguration;
