<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 text-break">
          ¿Estas seguro que quieres realizar la accion <br />
          "{{ currentActionTxt }}" en
          {{ selecteds.length }}
          {{ selecteds.length > 1 ? "usuarios" : "usuario" }}?
        </v-card-title>
        <v-card-text class="error--text">
          No podras revertir los cambios.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="confirm">Confirmar </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <div class="subtitle-2 mb-2">Selecciona la accion en cantidad</div> -->
    <div class="d-flex align-center">
      <v-card min-width="250" elevation="0" class="transparent mr-4">
        <v-select
          :disabled="loading"
          :items="actions"
          @click:clear="$emit('cancel')"
          label="Selecciona una accion"
          v-model="action"
          hide-details
          outlined
          clearable
          @change="$emit('action-selected', action)"
        >
        </v-select>
      </v-card>
      <v-tooltip bottom :disabled="!!selecteds.length">
        <template #activator="{ on, attrs }">
          <div v-on="on" v-bind="attrs">
            <v-btn
              @click="dialog = true"
              color="secondary"
              :disabled="!selecteds.length || loading"
            >
              Confirmar
            </v-btn>
          </div>
        </template>
        <span>
          Selecciona usuarios en la lista para {{ currentActionTxt }} en
          cantidad
        </span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import Actions from "../services/UserActions";
export default {
  props: {
    inQtyAction: String,
    selecteds: {
      type: Array,
      default: () => [],
    },
  },
  model: {
    prop: "inQtyAction",
    event: "action-selected",
  },
  data: () => ({
    actions: [
      { text: "Dejar de seguir", value: "unfollow" },
      { text: "Eliminar seguidores", value: "deletef" },
      { text: "Bloquear", value: "block" },
      { text: "Desblquear", value: "unblock" },
      { text: "Seguir", value: "follow" },
    ],
    action: "",
    dialog: false,
    loading: false,
  }),
  computed: {
    currentActionTxt() {
      if (!this.action) return "";
      return this.actions
        .find(({ value }) => value === this.action)
        .text.toLowerCase();
    },
    auth: get("account@auth"),
    pk: get("account@pk"),
  },
  methods: {
    async confirm() {
      Actions;
      this.dialog = false;
      this.loading = true;
      this.$emit("action-confirmed");
      for (const user of this.selecteds) {
        // await Actions[this.action](user, this.auth, this.pk);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.$emit("action-executed", user.pk);
      }

      this.loading = false;
      this.$emit("action-ended");
    },
  },
};
</script>

<style></style>
