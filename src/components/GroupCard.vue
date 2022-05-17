<template>
  <v-tooltip bottom :disabled="!disabled">
    <template #activator="{ attrs, on }" }>
      <div v-on="on" v-bind="attrs">
        <v-card
          :to="`/groups/${data.name}`"
          link
          height="100%"
          width="100%"
          elevation="0"
          hover
          :loading="loading"
          class="pb-3 px-3"
          :disabled="disabled || loading"
        >
          <div class="moreInfo">
            <v-tooltip bottom v-if="data.help">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="#ccc" v-bind="attrs" v-on="on">
                  mdi-help-circle
                </v-icon>
              </template>
              <span>{{ data.help }}</span>
            </v-tooltip>
          </div>
          <div class="font-weight-light pt-3" style="font-size: 28px">
            {{ data.title }}
          </div>
          <div class="subtitle-2" v-if="subtitle">En los ultimos 32 dias</div>
          <div class="font-weight-medium" style="font-size: 28px">
            <slot></slot>
          </div>
        </v-card>
      </div>
    </template>
    <span> Primero descarga tus datos </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    data: Object,
    disabled: Boolean,
    subtitle: String,
    loading: Boolean,
  },
};
</script>
<style>
.moreInfo {
  position: absolute;
  right: 5px;
  top: 5px;
}
.click {
  cursor: pointer;
}
</style>
