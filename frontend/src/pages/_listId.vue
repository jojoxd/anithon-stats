<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import {useTitle} from "../composition/useTitle";
import {ApiStatus} from "../composition/useApi";
import {useVModels} from "@vueuse/core";
import {IOverlayController} from "../plugin/overlay";
import {useList} from "../composition/composed/useList";

declare const $overlay: IOverlayController;

	export default defineComponent({
		props: {
			listId: {
				type: String,
				required: true,
			},
		},

		setup(props, {emit}) {
			const {listId} = useVModels(props, emit);

			const updating = ref<boolean>(false);

			const {
				chunkData,
				chunkStatus,
				chunkResponseStatus,

				entryData,
				entryStatus,
				entryResponseStatus,

				user: userData,

				listSettings,

				listData,

				status,

				update: updateList,
				reload: reloadList,
			} = useList(listId);

			const host = computed(() => {
				return `${window.location.protocol}//${window.location.host}`;
			});

			const embedImageUri = computed(() => {
				return `${host.value}/api/embed/${userData.value?.name}/${listId.value}.png`;
			});

			const title = useTitle();

			watch([userData, listData, updating, status], () => {
				if(status.value === ApiStatus.Failure) {
					title.value = "Error";
					return;
				} else if (status.value !== ApiStatus.Ok) {
					title.value = "Loading...";
					return;
				}

				if(updating.value) {
					title.value = "Updating...";
					return;
				}

				if(!userData.value || !listData.value) {
					title.value = null;
				} else {
					title.value = `${userData.value?.name} / ${listData.value?.name}`;
				}
			}, {immediate: true});

			async function update() {
				updating.value = true;

				await updateList()
				await reloadList();

				// Make the overlay feel more right (also less flashing)
				setTimeout(() => {
					updating.value = false;
				}, 1000);
			}

			watch([status], () => {
				if (updating.value)
					return;

				else if(status.value !== ApiStatus.Ok) {
					if (chunkStatus.value === ApiStatus.Failure) {
						$overlay.show(`Something went wrong fetching chunks (${chunkResponseStatus.value})`, `<a href="${window.location.href}">Reload</a>`, false);
						return;
					}

					if (entryStatus.value === ApiStatus.Failure) {
						$overlay.show(`Something went wrong fetching entries (${entryResponseStatus.value})`, `<a href="${window.location.href}">Reload</a>`, false);
						return;
					}

					$overlay.show("Loading", null, true);
				} else {
					$overlay.hide();
				}
			}, {immediate: true});

			watch(updating, () => {
				if (updating.value) {
					$overlay.show("Updating", null, true);
				} else {
					$overlay.hide();
				}
			});

			return {
				listId,
				listData,
				listSettings,

				embedImageUri,

				update,

				userData,
				entryData,
				chunkData,

				chunkStatus,
				ApiStatus,
			}
		}
	});
</script>

<template>
	<div>
		<h1>{{ userData?.name }} / {{ listData?.name }}</h1>

		<ListStats :list="listData"/>

		<div class="list-metadata" v-if="listSettings">
			<div class="form-control list-metadata list-metadata-allow-chunk-merge">
				<label>Allow Chunk Merge</label>
				<input type="checkbox" v-model="listSettings.allowChunkMerge" name="allowChunkMerge"/>
			</div>

			<div class="form-control list-metadata list-metadata-max-chunk-length">
				<label>Max chunk Length (Minutes)</label>
				<input type="number" v-model="listSettings.maxChunkLength" name="maxChunkLength"/>
			</div>

			<div class="form-control list-metadata list-metadata-max-chunk-join-length">
				<label>Max Chunk Join Length (Minutes)</label>
				<input type="number" v-model="listSettings.maxChunkJoinLength" name="maxChunkJoinLength"/>
			</div>
		</div>

		<a :href="embedImageUri" target="_blank">Embed</a>

		<div class="form-control update" v-if="true || (userData?.isCurrentUser ?? false)">
			<button @click="update()">Update</button>
		</div>

		<div class="dev" v-if="entryData">
			<Sortable v-model:items="entryData" :keys="(entry) => entry.series.id" :enabled="userData?.isCurrentUser ?? false"
								:prop-update="(entry, idx) => entry.savedData.order = idx">
				<template #item="{ item, up, down, index, upEnabled, downEnabled }">
					<EntryContainer :entry="item" :user="userData" @move-up="up" @move-down="down" :up-enabled="upEnabled"
													:down-enabled="downEnabled" :index="index"/>
				</template>
			</Sortable>
		</div>

		<div v-for="(chunk, index) of chunkData.chunks" v-if="chunkStatus === ApiStatus.Ok">
			<Chunk :chunk="chunk" :index="index"/>
		</div>
	</div>
</template>

<style scoped lang="scss">

.form-control {
	&.update {
		grid-template:
      [row1-start] "input" 1.4rem [row1-end]
                 / 100% !important;

		input, button {
			width: 100%;
		}
	}
}
</style>
