<template>
  <div class="d-flex">
    <div v-for="({ exp, icon, name, method, show_if }, i) of actions" :key="i">
      <v-tooltip bottom v-if="show_action(show_if)">
        <template #activator="{ attrs, on }">
          <div v-on="on" v-bind="attrs">
            <v-btn
              :loading="loadings[name]"
              small
              :disabled="!username || !password"
              class="mr-3"
              @click="method"
            >
              <v-icon>
                {{ icon }}
              </v-icon>
            </v-btn>
          </div>
        </template>
        <span>
          {{ exp }}
        </span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import Api from "../services/Api";
import { get } from "vuex-pathify";
import LocalDB from "../services/LocalDB.js";
import Storage from "../services/storage.js";
import { users_groups } from "../../configs";
export default {
  props: {
    type: String,
    user: Object,
  },
  data() {
    return {
      actions: [
        {
          name: "unfollow",
          exp: "Dejar de seguir",
          icon: "mdi-account-minus",
          method: this.unfollow,
          show_if: (type, { unfollowed, blocked, unblocked }) => {
            const obl = users_groups[type].actions.includes("unfollow");
            if (!obl) return false;
            return !unfollowed && !blocked && !unblocked;
            // users_groups[type].actions.includes("unfollow") && !unfollowed;
          },
        },
        {
          name: "follow",
          exp: "Seguir",
          icon: "mdi-account-arrow-up",
          method: this.follow,
          show_if: (type, { unfollowed, unblocked, followed }) =>
            (users_groups[type].actions.includes("follow") && !followed) ||
            unfollowed ||
            unblocked,
        },
        {
          name: "delete_follower",
          exp: "Eliminar seguidor",
          icon: "mdi-account-remove",
          method: this.delete_follower,
          show_if: (type, { blocked, unblocked }) =>
            users_groups[type].actions.includes("delete") & !blocked &&
            !unblocked,
        },
        {
          name: "block",
          exp: "Bloquear",
          icon: "mdi-account-cancel",
          method: this.block,
          show_if: (type, { blocked }) =>
            users_groups[type].actions.includes("block") && !blocked,
        },
        {
          name: "unblock",
          exp: "Desbloquear",
          icon: "mdi-account-key",
          method: this.unblock,
          show_if: (type, { blocked }) =>
            users_groups[type].actions.includes("unblock") || blocked,
        },
      ],
      loadings: {
        unfollow: false,
        delete: false,
        follow: false,
        block: false,
        unblock: false,
      },
      status: {
        unfollowed: false,
        blocked: false,
        deleted: false,
        followed: false,
        unblocked: false,
      },
    };
  },
  computed: {
    username: get("username"),
    password: get("password"),
    credentials() {
      return {
        username: this.username,
        password: this.password,
      };
    },
  },
  methods: {
    async unfollow() {
      this.loadings.unfollow = true;
      const res = await Api.friendship(this.credentials, "destroy", [
        this.user,
      ]);
      if (res.status === "success") {
        const { pk } = Storage.get_user_info(this.username);
        const localDB = LocalDB(pk);
        if (this.type === "idols") {
          await localDB.delete_user(this.user, ["following", "idols"]);
        } else {
          const user_in_idols = await localDB.get_user(this.user.pk, "idols");
          console.log(user_in_idols);
          if (user_in_idols) {
            await localDB.delete_user(this.user, ["following", "idols"]);
          } else {
            await localDB.delete_user(this.user, ["following", "friends"]);
          }
        }
        this.loadings.unfollow = false;
        this.set_status("unfollowed", true);
        this.set_status("followed", false);
        this.paint_row();
      }
    },
    async block() {
      this.loadings.block = true;
      const res = await Api.friendship(this.credentials, "block", [this.user]);
      if (res.status === "success") {
        const { pk } = Storage.get_user_info(this.username);
        const localDB = LocalDB(pk);
        const user_stores = await localDB.stores_of_user(this.user);
        await localDB.delete_user(this.user, user_stores);
        this.loadings.block = false;
        this.set_status("blocked", true);
        this.paint_row();
      }
    },
    async unblock() {
      this.loadings.unblock = true;
      const res = await Api.friendship(this.credentials, "unblock", [
        this.user,
      ]);
      if (res.status === "success") {
        this.set_status("unblocked", true);
        this.set_status("blocked", false);
        this.loadings.unblock = false;
      }
    },
    delete_follower() {
      //Comprobar si estaba en amigos, si estaba ahi borrarlo y agregalo a idolos.
      //Si no estaba en amigos y es un fan, borrarlo de fans
      console.log("ELIMINAR");
    },
    async follow() {
      this.loadings.follow = true;
      const res = await Api.friendship(this.credentials, "create", [this.user]);
      if (res.status === "success") {
        const { pk } = Storage.get_user_info(this.username);
        const localDB = LocalDB(pk);
        delete this.user.status;
        if (this.type === "idols") {
          await localDB.add_user(this.user, ["following", "idols"]);
        } else if (this.type === "fans") {
          await localDB.add_user(this.user, ["following", "friends"]);
        } else {
          const user_in_followers = await localDB.get_user(
            this.user.pk,
            "followers"
          );
          if (user_in_followers) {
            await localDB.add_user(this.user, ["following", "friends"]);
          } else await localDB.add_user(this.user, ["following", "idols"]);
        }

        this.set_status("followed", true);
        this.set_status("unfollowed", false);
        this.set_status("unblocked", false);
        this.loadings.follow = false;
      }
    },
    show_action(fn) {
      if (!this.user.status) this.user.status = {};
      const unfollowed = this.user.status.unfollowed || this.status.unfollowed;
      const blocked = this.user.status.blocked || this.status.blocked;
      const followed = this.user.status.followed || this.status.followed;
      const unblocked = this.user.status.unblocked || this.status.unblocked;
      return fn(this.type, { unfollowed, blocked, followed, unblocked });
    },
    paint_row() {
      this.$el.parentElement.parentElement.classList.add("red-row");
    },
    set_status(key, b) {
      if (!this.user.status) this.user.status = {};
      this.user.status[key] = b;
      this.status[key] = b;
    },
  },
};
</script>

<style></style>
