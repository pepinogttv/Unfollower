<template>
  <v-overlay :value="true" light opacity=".7" class="rounded-0">
    <div class="fill-height">
      <v-card
        light
        height="95vh"
        class="overflow-x-hidden overflow-y-auto"
        color="transparent"
        elevation="0"
      >
        <v-data-table
          style="width: 1600px; max-width: 90vw"
          :items-per-page="10"
          :headers="headers"
          :items="showedData"
          :page.sync="page"
          item-key="pk"
          show-select
          hide-default-footer
          :search="search"
          disable-sort
          v-model="selecteds"
          :loading="loading"
          @page-count="pageCount = $event"
          class="elevation-1 pt-1"
          @update:page="update_page"
        >
          <template v-slot:top>
            <div
              class="text-center pt-2 px-4 d-flex justify-space-between align-center"
            >
              <div>{{ title }}</div>
              <div>
                <v-btn
                  icon
                  exact
                  @click="$emit('click:close', { usersChanged })"
                >
                  <v-icon> mdi-close</v-icon>
                </v-btn>
              </div>
            </div>
            <v-row class="pb-2 px-4">
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  outlined
                  hide-details
                  label="Buscar por nombre de usuario"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <InQuantity
                  :selecteds="selecteds"
                  @action-confirmed="loading = true"
                  @action-ended="loading = false"
                  @cancel="selecteds = []"
                />
              </v-col>
              <v-col cols="6" class="d-flex justify-end align-center">
                <v-card max-width="250" elevation="0" class="transparent mr-4">
                  <v-select
                    :items="['Todos', 'Sin verificar', 'Verificados']"
                    v-model="show"
                    outlined
                    hide-details
                  >
                  </v-select>
                </v-card>
              </v-col>
            </v-row>
          </template>
          <template #item.profile_pic_url="{ item }">
            <ProfileImageInTable
              :profile_pic_url="item.profile_pic_url"
              :user="item"
            />
          </template>
          <template #item.username="{ item: { username, is_verified } }">
            <div class="d-flex align-center">
              <official-account-icon
                class="mr-2"
                v-if="is_verified"
              ></official-account-icon>
              {{ username }}
            </div>
          </template>
          <template #item.instagram="{ item: { username } }">
            <abbr
              :title="`Ver perfil de ${username} en instagram.`"
              class="text-decoration-none"
            >
              <v-btn small text class="px-0">
                <a
                  :href="`http://www.instagram.com/${username}`"
                  target="_blank"
                  class="text-decoration-none"
                  rel="noopener noreferrer"
                >
                  Ver perfil
                </a>
              </v-btn>
            </abbr>
          </template>
          <template #item.counts="{ item }">
            <Counts :user="item" v-if="!pagination" />
          </template>
          <template #item.actions="{ item }">
            <UserActions
              v-if="!pagination"
              @change:user="usersChanged = true"
              @delete-user="delete_user"
              :user="item"
              :type="group"
              :one-user-loading="oneUserLoading"
            />
            <div style="width: 220px; height: 1px" v-else></div>
          </template>
          <template #item.is_private="{ item: { is_private } }">
            {{ is_private ? "Privada" : "Publica" }}
          </template>
          <template #footer>
            <v-divider></v-divider>
            <div class="py-4">
              <v-pagination
                :disabled="loading"
                v-model="page"
                :length="pageCount"
                total-visible="10"
                circle
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-overlay>
</template>
<script>
import OfficialAccountIcon from "../components/OfficialAccountIcon.vue";
import UserActions from "../components/UserActions.vue";
import InQuantity from "./InQuantity.vue";
import Counts from "./Counts.vue";
import ProfileImageInTable from "./ProfileImageInTable.vue";
import { userGroups } from "../../configs";
export default {
  components: {
    OfficialAccountIcon,
    UserActions,
    Counts,
    InQuantity,
    ProfileImageInTable,
  },
  props: {
    relatedUsers: Object,
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Foto de perfil", value: "profile_pic_url" },
        { text: "Usuario", value: "username" },
        { text: "Nombre completo", value: "full_name" },
        { text: "Instagram", value: "instagram" },
        { text: "Cuenta", value: "is_private" },
        { text: "Seguidores/Seguidos", value: "counts" },
        { text: "Acciones", value: "actions" },
      ],
      showedData: [],
      show: "Todos",
      pagination: false,
      selecteds: [],
      inQtyAction: "",
      loading: false,
      usersChanged: false,
      page: 1,
      pageCount: 0,
      oneUserLoading: null,
    };
  },
  mounted() {
    if (!this.current_related_users.length) this.$router.push("/groups");
    this.showedData = this.current_related_users;
  },
  computed: {
    group() {
      return this.$route.params.group;
    },
    current_related_users() {
      if (!this.relatedUsers) return [];
      return this.relatedUsers[this.group];
    },
    title() {
      const { title, help } = userGroups.find(({ name }) => name == this.group);
      return `${title} (${help})`;
    },
  },
  methods: {
    delete_user({ user, stores }) {
      for (const store of stores) {
        const current_data = this.relatedUsers[store];
        const user_in_store = current_data.find(({ pk }) => user.pk === pk);
        const index_to_delete = current_data.indexOf(user_in_store);
        current_data.splice(index_to_delete, 1);
      }
      this.showedData = this.current_related_users;
    },
    update_page() {
      this.pagination = true;
      setTimeout(() => (this.pagination = false));
    },
  },
  watch: {
    show(value) {
      this.update_page();

      if (value === "Todos" || !value)
        this.showedData = this.current_related_users;
      else if (value === "Verificados")
        this.showedData = this.current_related_users.filter(
          ({ is_verified }) => is_verified
        );
      else if (value === "Sin verificar")
        this.showedData = this.current_related_users.filter(
          ({ is_verified }) => !is_verified
        );
    },
    search() {
      this.update_page();
    },
    inQtyAction() {
      this.selecteds = [];
    },
  },
};
</script>

<style>
.red-row {
  background: rgba(255, 0, 0, 0.2);
}
.v-data-table-header .v-data-table__checkbox {
  visibility: hidden;
}
.a {
  text-decoration: none;
}
</style>
