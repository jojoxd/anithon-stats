<script lang="ts">
import {computed, defineComponent, ref} from "vue";
	import {useCurrentUser} from "../composition/useCurrentUser";
	import {mdiLogoutVariant} from "@mdi/js";

	export default defineComponent({
		setup() {
			const menuOpen = ref<boolean>(false);

			const { currentUser } = useCurrentUser();
			const language = ref('test');

			const logoutUri = computed(() => {
				return `/api/oauth/logout?redirect=${encodeURIComponent(window.location.href)}`;
			});

			return {
				menuOpen,
				currentUser,
				language,

				logoutUri,
				mdiLogoutVariant
			};
		}
	});
</script>

<template>
	<div>
		<v-menu
			v-model="menuOpen"
			:close-on-content-click="false"
		>
			<template #activator="{ props }">
				<slot name="activator" :props="props">
					<v-btn
						color="indigo"
						v-bind="props"
					>
						Settings
					</v-btn>
				</slot>
			</template>

			<v-card min-width="300">
				<v-list>
					<v-list-item
						:prepend-avatar="currentUser?.avatar?.large"
						:title="currentUser?.name"
						subtitle="Logged in from AniList"
					>
						<template #subtitle>
							Logged in from AniList
						</template>
					</v-list-item>
				</v-list>

				<v-divider />

				<v-list>
					<v-list-item class="text-center">
						<v-btn
							:append-icon="mdiLogoutVariant"
							variant="plain"
							:href="logoutUri"
						>
							Log out
						</v-btn>
					</v-list-item>

					<v-list-item>
						<language-switcher />
					</v-list-item>
				</v-list>
			</v-card>
		</v-menu>
	</div>
</template>
