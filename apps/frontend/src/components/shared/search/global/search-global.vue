<script lang="ts">
	import {computed, defineComponent, ref} from "vue";
	import {mdiArrowLeft, mdiMagnify} from "@mdi/js";
	import {useRouter} from "vue-router";
	import {breakpointsVuetify, useBreakpoints} from "@vueuse/core";
  import {storeToRefs} from "pinia";
  import SearchGlobalListEntry from "./search-global-list-entry.vue";
  import {useSearch} from "../../../../composition/useSearch";
  import {useAuthStore} from "../../../../composition/store/auth.store";
  import {ApiStatus} from "../../../../composition/useApi";
  import {SearchGlobalListDto, SearchGlobalUserDto} from "@anistats/shared";

	export default defineComponent({
    components: {SearchGlobalListEntry},
    setup() {
			const query = ref<string>(null);
			const textField = ref<HTMLElement>(null);

			const {
				users,
        lists,
				searchStatus,
			} = useSearch(query);

			const {
			  currentUser
      } = storeToRefs(useAuthStore());

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

			function goToList(list: SearchGlobalListDto)
      {
        close();

        router.push(`/l/${list.id}`);
      }

      function goToUser(user: SearchGlobalUserDto)
      {
        close();

        router.push(`/u/${user.id}`);
      }

      function close()
      {
        dialogOpen.value = false;
        query.value = "";
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

        goToUser,
        goToList,

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
              <search-global-user-entry
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  @click="goToUser(user)"
              ></search-global-user-entry>

							<v-list-item
								v-if="users.length === 0"
							>No Users Found</v-list-item>
						</v-list>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" lg="6" v-if="currentUser && query && !isLoading">
				<v-card>
					<v-card-title>Your Lists</v-card-title>

					<v-card-text>
						<v-list v-if="!isLoading">
              <search-global-list-entry
                v-for="list of lists"
                :key="list.id"
                :list="list"
                @click="goToList(list)"
              ></search-global-list-entry>

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
