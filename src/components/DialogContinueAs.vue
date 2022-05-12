<template>
  <div>
    <v-dialog v-model="dialog" max-width="300" persistent>
      <v-card class="pt-4">
        <v-list>
          <div v-for="(ac, i) of accounts" :key="i">
            <v-list-item dense link @click="setAccount(ac)">
              <v-list-item-avatar>
                <img :src="ac.profile_pic_base64" alt="John" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ ac.username }}</v-list-item-title>
                <v-list-item-subtitle>{{ ac.full_name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
        <v-card-actions @click="addAccount">
          <v-btn block color="secondary" text> Ingresar con otra cuenta</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  data: () => ({
    dialog: false,
  }),
  computed: {
    accounts: get("accounts"),
    account: get("account"),
  },
  methods: {
    setAccount(account) {
      this.$store.set("account", { account });
      this.dialog = false;
    },
    addAccount() {
      this.$emit("add-account");
      this.dialog = false;
    },
  },
  created() {
    if (this.accounts.length > 1) this.dialog = true;
  },
  watch: {
    account(value) {
      if (!value && this.accounts.length) this.dialog = true;
    },
  },
};
</script>

<style></style>
