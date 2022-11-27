<script lang="ts">
	import {computed, defineComponent, ref, watch} from "vue";
	import {useTitle} from "../../composition/useTitle";
	import {ApiStatus} from "../../composition/useApi";
	import {useVModels} from "@vueuse/core";
	import {IOverlayController} from "../../plugin/overlay";
	import {useList} from "../../composition/composed/useList";
	import {mdiContentSave} from "@mdi/js";

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

				mdiContentSave,
			}
		}
	});
</script>

<template>
	<div>
		<h1>{{ userData?.name }} / {{ listData?.name }}</h1>

		<ListStats :list="listData"/>

		<list-settings-card v-model="listSettings" v-if="listSettings" />

		<v-btn :href="embedImageUri" target="_blank">Embed Image</v-btn>

		<template v-if="userData?.isCurrentUser ?? false">
			<v-btn
				variant="tonal"
				color="success"
				:prepend-icon="mdiContentSave"
				@click.prevent="update"
			>Update</v-btn>
		</template>

		<div class="dev" v-if="entryData">
			<Sortable v-model:items="entryData" :keys="(entry) => entry.series.id" :enabled="userData?.isCurrentUser ?? false"
								:prop-update="(entry, idx) => entry.savedData.order = idx">
				<template #item="{ item, up, down, index, upEnabled, downEnabled }">
					<EntryContainer :entry="item" :user="userData" @move-up="up" @move-down="down" :up-enabled="upEnabled"
													:down-enabled="downEnabled" :index="index"/>
				</template>
			</Sortable>
		</div>

		<chunk-list :chunks="chunkData.chunks" v-if="chunkStatus === ApiStatus.Ok" />
	</div>
</template>
