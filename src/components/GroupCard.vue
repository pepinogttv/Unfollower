<template>
  <div class="relative">
    <div class="moreInfo">
      <v-tooltip bottom v-if="data.help">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on"> mdi-help-circle </v-icon>
        </template>
        <span>{{ data.help }}</span>
      </v-tooltip>
    </div>
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
      <div
        class="font-weight-light pt-3"
        style="font-size: 28px; line-height: 35px"
      >
        {{ data.title }}
      </div>
      <div class="font-weight-medium" style="font-size: 28px">
        <slot></slot>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    disabled: Boolean,
    loading: Boolean,
  },
};
</script>
<style>
.moreInfo {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
}
.click {
  cursor: pointer;
}
.relative {
  position: relative;
}
</style>
