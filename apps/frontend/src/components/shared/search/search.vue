<script lang="ts">
	import {computed, defineComponent, ref} from "vue";
	import {mdiArrowLeft, mdiMagnify} from "@mdi/js";
	import {ApiStatus} from "../../../composition/useApi";
	import {useSearch} from "../../../composition/useSearch";
	import {useRouter} from "vue-router";
  import {SearchItemListDto, SearchItemUserDto, SearchResponse} from "@anistats/shared";
	import {breakpointsVuetify, useBreakpoints, useArrayFilter} from "@vueuse/core";
	import {useCurrentUser} from "../../../composition/useCurrentUser";

	export default defineComponent({
		setup() {
			const query = ref<string>(null);
			const textField = ref<HTMLElement>(null);

			const {
				users,
        lists,
				searchStatus,
			} = useSearch(query);

			const { currentUser } = useCurrentUser();

			const router = useRouter();

			const breakpoints = useBreakpoints(breakpointsVuetify);

			const isLoading = computed(() => {
				return searchStatus.value !== ApiStatus.Ok && searchStatus.value !== ApiStatus.Initial;
			});

			const isDialogFullscreen = breakpoints.smaller("sm");
			const dialogOpen = ref(false);

			const dialogWidth = computed(() => {
				if (isDialogFullscreen.value)
					return null;

				if (breakpoints.isGreater("md")) {
					return 900;
				}

				return 400;
			});

			function go(item: SearchItemUserDto | SearchItemListDto): void
			{
				dialogOpen.value = false;
				query.value = "";

        if ('uuid' in item) {
          router.push(`/l/${item.uuid}`);
          return;
        }

				if('name' in item) {
					router.push(`/u/${item.name}`);
          return;
				}

				throw new Error(`Items Exhausted: ${item}`);
			}

			return {
				query,
				textField,

				users,
				lists,

				dialogOpen,
				dialogWidth,
				isDialogFullscreen,
				currentUser,

				isLoading,
				go,

				mdiMagnify,
				mdiArrowLeft,
			};
		},
	});
</script>

<template>
	<v-dialog v-model="dialogOpen" :fullscreen="isDialogFullscreen" :width="dialogWidth">
		<template #activator="{ props }">
			<v-btn variant="plain" :icon="mdiMagnify" v-bind="props"></v-btn>
		</template>

		<v-row>
			<v-col cols="12">
				<v-text-field
					ref="textField"
					v-model="query"
					:loading="isLoading"
					variant="solo"
					hide-details
					clearable
					label="Search"
					:prepend-inner-icon="mdiMagnify"
				></v-text-field>
			</v-col>

			<v-col cols="12" lg="6" v-if="query">
				<v-card>
					<v-card-title>Users</v-card-title>

					<v-card-text>
						<v-list v-if="!isLoading">
							<v-list-item
								v-for="user of users"
								@click="go(user)"
								:key="user.uuid"
								:title="user.name"
								:prepend-avatar="user.avatar"
							></v-list-item>

							<v-list-item
								v-if="users.length === 0"
							>No Users Found</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" lg="6" v-if="currentUser.isAuthenticated && query && !isLoading">
				<v-card>
					<v-card-title>Your Lists</v-card-title>

					<v-card-text>
						<v-list v-if="!isLoading">
							<v-list-item
								v-for="list of lists"
								@click="go(list)"
								:key="list.uuid"
								:title="list.name"
							></v-list-item>

							<v-list-item
								v-if="lists.length === 0"
							>No Lists Found</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-dialog>
</template>

<style scoped lang="scss">
</style>
