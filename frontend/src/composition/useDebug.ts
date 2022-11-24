import {useLocalStorage, StorageSerializers} from "@vueuse/core";
import { readonly, Ref } from "vue";

const DEBUG_LOCALSTORAGE_KEY = 'debug.enabled';

const isDebugEnabled = useLocalStorage<boolean>(DEBUG_LOCALSTORAGE_KEY, false, { serializer: StorageSerializers.boolean });

export function useDebug()
{
	return {
		isDebugEnabled,
	};
}
