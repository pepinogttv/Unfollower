<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 text-break">
          Estas seguro que quieres realizar la accion <br />
          "{{ currentActionTxt }}" en
          {{ selecteds.length }}
          {{ selecteds.length > 1 ? "usuarios" : "usuario" }}.
        </v-card-title>
        <v-card-text class="error--text">
          No podras revertir los cambios.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Cancelar</v-btn
          >
          <v-btn
            color="blue darken-1"
            text
            @click="$emit('action-confirmed', action)"
            >Confirmar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <div class="subtitle-2 mb-2">Selecciona la accion en cantidad</div> -->
    <div class="d-flex align-center">
      <v-card min-width="250" elevation="0" class="transparent mr-4">
        <v-select
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
              :disabled="!selecteds.length"
              v-if="action"
            >
              {{ currentActionTxt }} seleccionados
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
      { text: "Eliminar seguidores", value: "delete" },
      { text: "Bloquear", value: "block" },
      { text: "Desblquear", value: "unblock" },
      { text: "Seguir", value: "follow" },
    ],
    action: "",
    dialog: false,
  }),
  computed: {
    currentActionTxt() {
      if (!this.action) return "";
      return this.actions
        .find(({ value }) => value === this.action)
        .text.toLowerCase();
    },
  },
};
</script>

<style></style>
