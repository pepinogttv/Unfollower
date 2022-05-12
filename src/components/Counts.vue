<template>
  <div>
    <v-snackbar v-model="snackbar" elevation="0" top>
      No se pueden cargar los seguidores/seguidos por limitaciones de instagram.
      Porfavor intente mas tarde.
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          cerrar
        </v-btn>
      </template>
    </v-snackbar>
    <div v-if="!validCounts">
      <v-btn
        color="primary"
        small
        text
        class="px-0"
        @click="setCounts"
        :loading="loading"
      >
        Ver
      </v-btn>
    </div>
    <div v-else>
      <span class="subtitle-2">{{ follower_count | count }}</span>
      <v-icon>mdi-slash-forward</v-icon>
      <span class="subtitle-2">{{ following_count | count }}</span>
    </div>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import Api from "../services/Api";

export default {
  props: {
    user: Object,
  },
  filters: {
    count(value) {
      const str = String(value);
      if (str.length >= 9) return `${str[0] + str[1] + str[2]}m`;
      if (str.length === 8) return `${str[0] + str[1]}m`;
      if (str.length === 7) return `${str[0]}m`;
      if (str.length === 6) return `${str[0] + str[1] + str[2]}k`;
      if (str.length === 5) return `${str[0] + str[1]}k`;
      if (str.length === 4) return `${str[0]},${str[1] + str[2] + str[3]}`;
      else return value;
    },
  },
  data() {
    return {
      loading: false,
      following_count: 0,
      follower_count: 0,
      snackbar: false,
    };
  },
  async created() {
    if (this.user.following_count >= 0 && this.user.follower_count >= 0) {
      this.follower_count = this.user.follower_count;
      this.following_count = this.user.following_count;
    }
  },
  methods: {
    async setCounts() {
      this.loading = true;
      const res = await Api.getUserInfo(this.account.auth, this.user.pk);
      console.log(res);
      if (res.status === "success") {
        this.follower_count = res.data.follower_count;
        this.user.follower_count = this.follower_count;
        this.following_count = res.data.following_count;
        this.user.following_count = this.following_count;
      } else if (res.status === "error") this.snackbar = true;
      this.loading = false;
    },
  },
  computed: {
    account: get("account"),
    validCounts() {
      return this.follower_count && this.following_count;
    },
  },
};
</script>

<style></style>
