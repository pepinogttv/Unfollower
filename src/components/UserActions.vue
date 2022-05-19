<template>
  <div class="d-flex">
    <div v-for="({ exp, icon, name, method, show_if }, i) of actions" :key="i">
      <v-tooltip bottom>
        <template #activator="{ attrs, on }">
          <div v-on="on" v-bind="attrs">
            <v-btn
              elevation="1"
              :loading="loadings[name]"
              :disabled="!show_action(show_if) || loadings.is || !!inQtyAction"
              @click="method"
              x-small
              fab
              class="mr-3"
            >
              <v-icon>
                {{ icon }}
              </v-icon>
            </v-btn>
          </div>
        </template>
        <span>
          {{ typeof exp === "string" ? exp : exp() }}
        </span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import Actions from "../services/UserActions";
import { get } from "vuex-pathify";
import UsersDB from "../services/RelatedUsersDB";

export default {
  props: {
    type: String,
    user: Object,
    inQtyAction: String,
  },
  data() {
    return {
      actions: [
        {
          name: "unfollow",
          exp: () =>
            this.pending_request ? "Cancelar solicitud" : "Dejar de seguir",
          icon: "mdi-account-minus",
          method: this.unfollow,
          show_if({ followed, blocked, pending_request }) {
            if (pending_request) return false;
            if (followed) return true;
            else if (blocked) return false;
            else return false;
          },
        },
        {
          name: "follow",
          exp: () => (this.user.is_private ? "Solicitar seguir" : "Seguir"),
          icon: "mdi-account-arrow-up",
          method: this.follow,
          show_if({ followed, blocked, pending_request }) {
            if (pending_request) return false;
            if (followed) return false;
            else if (blocked) return false;
            else return true;
          },
        },
        {
          name: "block",
          exp: "Bloquear",
          icon: "mdi-account-cancel",
          method: this.block,
          show_if({ blocked }) {
            if (blocked) return false;
            else return true;
          },
        },
        {
          name: "unblock",
          exp: "Desbloquear",
          icon: "mdi-account-key",
          method: this.unblock,
          show_if({ blocked }) {
            if (blocked) return true;
            else return false;
          },
        },
        {
          name: "deletef",
          exp: "Eliminar seguidor",
          icon: "mdi-account-remove",
          method: this.deletef,
          show_if({ deleted, blocked }) {
            if (deleted || blocked) return false;
            else return true;
          },
        },
      ],
      loadings: {
        unfollow: false,
        deletef: false,
        follow: false,
        block: false,
        unblock: false,
        is: false,
      },
      followed: false,
      blocked: false,
      deleted: false,
      pending_request: false,
    };
  },
  methods: {
    loading(key) {
      this.loadings[key] = !this.loadings[key];
    },
    async unfollow() {
      this.loading("unfollow");
      const error = await Actions.unfollow({
        user: this.user,
        auth: this.account.auth,
        pk: this.account.pk,
      });
      if (error) return console.error(error);
      this.userChange();
      this.unfollowed = true;
      this.followed = false;
      this.blocked = false;
      this.loading("unfollow");
    },
    async follow() {
      this.loading("follow");
      const error = await Actions.follow({
        user: this.user,
        auth: this.account.auth,
        pk: this.account.pk,
      });
      if (error) return console.error(error);
      if (this.user.is_private) this.pending_request = true;
      this.userChange();
      this.followed = true;
      this.blocked = false;
      this.loading("follow");
    },
    async block() {
      this.loading("block");
      const error = await Actions.block({
        user: this.user,
        auth: this.account.auth,
        pk: this.account.pk,
      });
      if (error) return console.error(error);
      this.userChange();
      this.followed = false;
      this.blocked = true;
      this.deleted = true;
      this.loading("block");
    },
    async unblock() {
      this.loading("unblock");
      const error = await Actions.unblock({
        user: this.user,
        auth: this.account.auth,
        pk: this.account.pk,
      });
      if (error) return console.error(error);
      this.userChange();
      this.followed = false;
      this.blocked = false;
      this.loading("unblock");
    },
    async deletef() {
      this.loading("deletef");
      const error = await Actions.deletef({
        user: this.user,
        auth: this.account.auth,
        pk: this.account.pk,
      });
      if (error) return console.error(error);
      this.userChange();
      this.deleted = true;
      this.loading("deletef");
    },
    show_action(fn) {
      const { blocked, followed, deleted, pending_request } = this;
      return fn({ followed, blocked, deleted, pending_request });
    },
    handleInQtyAction() {
      const row = this.$el.parentElement.parentElement;
      const checkbox = row.querySelector(".v-data-table__checkbox");
      if (!checkbox) return;
      if (!this.inQtyAction) {
        checkbox.style.visibility = "hidden";
        return;
      }
      const action = this.actions.find(({ name }) => name === this.inQtyAction);
      if (this.show_action(action.show_if)) {
        checkbox.removeAttribute("style");
      } else {
        checkbox.style.visibility = "hidden";
      }
    },
    userChange() {
      console.log("user change in action log");
      this.$emit("change:user");
    },
  },
  computed: {
    account: get("account"),
  },
  async created() {
    // if (!this.inQtyAction) this.handleInQtyAction();
    const { pk } = this.account;
    const DB = await UsersDB(pk);
    this.loadings.is = true;
    const [isFollowing, isFollower] = await Promise.all([
      DB.getUser(this.user.pk, "following"),
      DB.getUser(this.user.pk, "followers"),
    ]);
    // console.log({ isFollowing, isFollower });

    this.followed =
      this.type === "following" ||
      this.type === "idols" ||
      this.type === "friends" ||
      isFollowing;

    if (this.user.pending_request) {
      this.pending_request = true;
      console.log({
        pending_request: this.user.pending_request,
        user: this.user.username,
      });
    }
    if (isFollower) this.deleted = false;
    else this.deleted = true;

    this.loadings.is = false;
  },
  mounted() {
    this.handleInQtyAction();
  },
  watch: {
    inQtyAction() {
      this.handleInQtyAction();
    },
  },
};
</script>

<style></style>
