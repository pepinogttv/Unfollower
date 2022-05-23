<template>
  <div class="d-flex">
    <div v-for="({ exp, icon, name, method, show_if }, i) of actions" :key="i">
      <v-tooltip bottom>
        <template #activator="{ attrs, on }">
          <div v-on="on" v-bind="attrs">
            <v-btn
              elevation="1"
              :loading="loadings[name] || loadings.actionInQty"
              :disabled="
                !show_action(show_if) || loadings.is || loadings.actionInQty
              "
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
    oneUserLoading: Number,
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
        actionInQty: false,
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
    handleActionInQty() {
      const row = this.$el.parentElement.parentElement;
      const checkbox = row.querySelector(".v-data-table__checkbox");
      if (!checkbox) {
        console.log("El checkbox no existe");
        return;
      }

      if (!this.actionInQty) {
        console.log("this.actionInQty no existe");
        checkbox.style.visibility = "hidden";
        return;
      }

      const action = this.actions.find(({ name }) => name === this.actionInQty);
      console.log({ action: this.show_action(action.show_if) });

      if (this.show_action(action.show_if)) {
        checkbox.removeAttribute("style");
      } else {
        checkbox.style.visibility = "hidden";
      }
    },
    userChange() {
      this.$emit("change:user");
    },
    async init() {
      const { pk } = this.account;
      const DB = await UsersDB(pk);
      this.loadings.is = true;
      const [isFollowing, isFollower] = await Promise.all([
        DB.getUser(this.user.pk, "following"),
        DB.getUser(this.user.pk, "followers"),
      ]);

      this.followed =
        this.type === "following" ||
        this.type === "idols" ||
        this.type === "friends" ||
        isFollowing;

      if (isFollower) this.deleted = false;
      else this.deleted = true;

      this.loadings.is = false;
      this.handleActionInQty();
    },
  },
  computed: {
    account: get("account"),
    actionInQty: get("actionInQty"),
    actionInQtyCurrentLoadingStart: get("actionInQtyCurrentLoadingStart"),
    actionInQtyCurrentLoadingEnd: get("actionInQtyCurrentLoadingEnd"),
  },
  async created() {
    this.init();
  },
  watch: {
    actionInQty() {
      this.handleActionInQty();
    },
    actionInQtyCurrentLoadingStart(pk) {
      if (this.user.pk === pk) this.loadings.actionInQty = true;
    },
    actionInQtyCurrentLoadingEnd(pk) {
      if (this.user.pk === pk) this.loadings.actionInQty = false;
    },
  },
};
</script>

<style></style>
