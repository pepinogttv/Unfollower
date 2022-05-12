<template>
  <v-overlay :value="true" light opacity=".7" class="rounded-0">
    <div class="fill-height">
      <v-card
        light
        height="90vh"
        class="overflow-x-hidden overflow-y-auto"
        color="transparent"
        elevation="0"
      >
        <v-data-table
          style="width: 1600px; max-width: 100%"
          :items-per-page="10"
          :headers="headers"
          :items="showedData"
          item-key="pk"
          show-select
          :search="search"
          disable-sort
          v-model="selecteds"
          class="elevation-1 pt-1"
          @update:page="update_page"
        >
          <template v-slot:top>
            <div
              class="text-center pt-2 px-4 d-flex justify-space-between align-center"
            >
              <div>{{ title }}</div>
              <div>
                <v-btn icon to="/groups" exact>
                  <v-icon> mdi-close</v-icon>
                </v-btn>
              </div>
            </div>
            <v-row class="pb-2 px-4">
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  outlined
                  hide-details=""
                  label="Buscar por nombre de usuario"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <InQuantity
                  v-model="inQtyAction"
                  :selecteds="selecteds"
                  @cancel="selecteds = []"
                />
              </v-col>
              <v-col cols="2" class="d-flex justify-end align-center">
                <v-checkbox
                  class="mr-6"
                  label="Ver solo verificados"
                  v-model="onlyVerified"
                ></v-checkbox>
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
              :user="item"
              :type="group"
              @delete-user="delete_user"
              :in-qty-action="inQtyAction"
            />
            <div style="width: 220px; height: 1px" v-else></div>
          </template>
          <template #item.is_private="{ item: { is_private } }">
            {{ is_private ? "Privada" : "Publica" }}
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
        {
          text: "Nombre de usuario",
          value: "username",
        },
        { text: "Nombre completo", value: "full_name" },
        { text: "Instagram", value: "instagram" },
        { text: "Cuenta", value: "is_private" },
        // { text: "Seguidores", value: "follower_count" },
        // { text: "Seguidos", value: "following_count" },
        { text: "Seguidores/Seguidos", value: "counts" },
        { text: "Acciones", value: "actions" },
      ],
      showedData: [],
      onlyVerified: false,
      pagination: false,
      selecteds: [],
      inQtyAction: "",
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
    title() {
      const { group } = this;
      if (group === "followers") return "Seguidores";
      if (group === "following") return "Seguidos";
      if (group === "fans")
        return "Fanes (usuarios que te siguen y vos no seguis)";
      if (group === "idols")
        return "Idolos (usuarios que seguis y no te siguen)";
      return "Amigos (Lo seguis y te sigue)";
    },
    current_related_users() {
      if (!this.relatedUsers) return [];
      return this.relatedUsers[this.group];
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
    onlyVerified() {
      this.update_page();
      if (this.onlyVerified)
        this.showedData = this.current_related_users.filter(
          ({ is_verified }) => is_verified
        );
      else this.showedData = this.current_related_users;
    },
    search() {
      this.update_page();
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
