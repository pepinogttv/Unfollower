<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
    :disabled="!accounts || !accounts.length"
  >
    <template #activator="{ on, attrs }">
      <div v-on="on" v-bind="attrs">
        <v-badge
          bordered
          icon="mdi-sync"
          bottom
          offset-x="20"
          offset-y="20"
          :value="accounts.length > 1"
        >
          <v-avatar size="60" class="elevation-2">
            <v-img
              :src="account ? account.profile_pic_base64 : defaultBase64"
            ></v-img>
          </v-avatar>
        </v-badge>
      </div>
    </template>
    <v-card v-if="accounts && accounts.length">
      <v-list v-if="account">
        <v-list-item>
          <v-list-item-avatar>
            <img :src="account.profile_pic_base64" alt="John" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ account.username }}</v-list-item-title>
            <v-list-item-subtitle>{{ account.full_name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item dense link v-if="account">
          <a
            :href="`https://www.instagram.com/${account.username}`"
            target="_blank"
            class="text-decoration-none"
          >
            Ver perfil
          </a>
        </v-list-item>
        <v-menu offset-x :disabled="accounts.length < 2">
          <template #activator="{ attrs, on }">
            <v-list-item
              dense
              link
              v-on="on"
              v-bind="attrs"
              :disabled="accounts.length < 2"
            >
              {{ account ? "Cambiar cuenta" : "Seleccionar cuenta" }}
            </v-list-item>
          </template>
          <v-list>
            <div v-for="(ac, i) of accounts" :key="i">
              <v-list-item
                dense
                v-if="account ? ac.pk !== account.pk : true"
                link
                @click="changeAccount(ac)"
              >
                <v-list-item-avatar>
                  <img :src="ac.profile_pic_base64" alt="John" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ ac.username }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    ac.full_name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
        <v-list-item dense link @click="$emit('add-account')">
          Ingresar con otra cuenta
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  data: () => ({
    menu: false,
    defaultBase64:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Z9vjM-_Ww_rUHKOYFQ3brhBsKWniGSN7jembYtImHkPzHReyZ4zNBlPF550WjI8a_eE&usqp=CAU",
  }),
  computed: {
    account: get("account"),
    accounts: get("accounts"),
  },
  methods: {
    changeAccount(account) {
      this.menu = false;
      this.$emit("change-account", account);
    },
  },
};
</script>

<style></style>
