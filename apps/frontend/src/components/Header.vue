<script lang="ts">
  import {computed, defineComponent} from "vue";
	import UserSettingsMenu from "./UserSettingsMenu.vue";
	import {mdiHome, mdiLoginVariant} from "@mdi/js";
  import {storeToRefs} from "pinia";
  import {useAuthStore} from "../composition/store/auth.store";

  export default defineComponent({
		components: {UserSettingsMenu},
		setup() {
		  const authStore = useAuthStore();
      const {
        currentUser,
      } = storeToRefs(authStore);

      authStore.reloadCurrentUser();

      const oauthUri = computed(() => {
        return `/api/connect/anilist?redirect=${encodeURIComponent(window.location.href)}`;
      });

      return {
        currentUser,

        oauthUri,

				mdiHome,
				mdiLoginVariant,
      };
    }
  });
</script>

<template>
	<v-app-bar app>
		<v-app-bar-title class="app-title">
				AniStats
		</v-app-bar-title>


		<search />

		<v-btn to="/" variant="plain" :prepend-icon="mdiHome">
			Home
		</v-btn>

		<div v-if="currentUser">
			<user-settings-menu>
				<template #activator="{ props }">
					<v-btn icon variant="plain" v-bind="props">
						<v-avatar :image="currentUser.avatar" />
					</v-btn>
				</template>
			</user-settings-menu>
		</div>
		<div v-else>
			<v-btn
				:prepend-icon="mdiLoginVariant"
				:href="oauthUri"
        variant="plain"
			>
				Log in
			</v-btn>
		</div>
	</v-app-bar>
</template>
