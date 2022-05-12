<template>
  <v-card
    class="mx-auto elevation-0 pa-8"
    color="transparent"
    height="650px"
    max-height="75vh"
    width="900"
    max-width="100%"
  >
    <DialogContinueAs @add-account="credDialog = true" />
    <v-dialog v-model="credDialog" max-width="600">
      <Credentials
        @saved-user-selected="setRelatedUsers"
        @logged-in="credDialog = false"
      />
    </v-dialog>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <ProfileImage
          @add-account="credDialog = true"
          @change-account="changeAccount"
        />
      </div>
      <div class="d-flex">
        <v-btn
          @click="credDialog = true"
          color="secondary"
          outlined
          v-show="!account"
        >
          <v-icon left>mdi-login</v-icon>
          Iniciar sesion
        </v-btn>
        <v-btn v-show="account" outlined @click="deletAccount(account)">
          <v-icon left>mdi-logout</v-icon> Cerrar sesion
        </v-btn>
        <v-tooltip bottom :disabled="!!account">
          <template #activator="{ attrs, on }" }>
            <div v-on="on" v-bind="attrs">
              <v-btn
                class="ml-3"
                color="secondary"
                :disabled="!account"
                outlined
                :loading="loading"
                @click="updateRelatedUsers"
              >
                <v-icon left>mdi-download</v-icon>
                {{ isFirstDB ? "Descargar" : "Actualizar" }} datos
              </v-btn>
            </div>
          </template>
          <span>Completa tus credenciales</span>
        </v-tooltip>
      </div>
    </div>
    <v-row>
      <v-col cols="12" md="6" v-for="(group, i) of groups" :key="i">
        <GroupCard
          :data="group"
          :disabled="!relatedUsers"
          :loading="loading"
          v-if="group.isMain || (relatedUsers && relatedUsers[group.name])"
        >
          {{ relatedUsers ? relatedUsers[group.name].length : 0 }}
        </GroupCard>
      </v-col>
    </v-row>
    <UnfollowerTable :related-users="relatedUsers" v-if="group" />
  </v-card>
</template>

<script>
import UnfollowerTable from "../components/UnfollowerTable.vue";
import GroupCard from "../components/GroupCard.vue";
import Credentials from "../components/Credentials.vue";
import ProfileImage from "../components/ProfileImage.vue";
import DialogContinueAs from "../components/DialogContinueAs.vue";
import { userGroups } from "../../configs";
import {
  updateRelatedUsers,
  getRelatedUsers,
  isFirstDB,
} from "../services/Common";
import { get, call } from "vuex-pathify";

export default {
  components: {
    UnfollowerTable,
    GroupCard,
    Credentials,
    ProfileImage,
    DialogContinueAs,
  },
  data: () => ({
    relatedUsers: null,
    loading: false,
    groups: userGroups,
    isFirstDB: true,
    addAccount: false,
    credDialog: false,
  }),
  methods: {
    async updateRelatedUsers() {
      this.loading = true;
      await updateRelatedUsers(this.account);
      this.setRelatedUsers();
      this.loading = false;
    },
    async setRelatedUsers() {
      this.loading = true;
      this.isFirstDB = await isFirstDB(this.account.pk);
      this.relatedUsers = await getRelatedUsers(this.account.pk);
      this.loading = false;
    },
    ru_accesor(prop) {
      if (this.relatedUsers) {
        return this.relatedUsers[prop];
      }
      return [];
    },
    deletAccount: call("deleteAccount"),
    changeAccount(account) {
      this.$store.set("account", { account });
    },
  },
  computed: {
    group() {
      return this.$route.params.group;
    },
    account: get("account"),
    accounts: get("accounts"),
  },
  created() {
    if (this.account) this.setRelatedUsers();
  },
  watch: {
    account(value) {
      if (!value) this.relatedUsers = null;
      else this.setRelatedUsers();
    },
    addAccount() {
      console.log(this.addAccount);
    },
  },
};
</script>
