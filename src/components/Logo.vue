<template>
  <router-link to="/" style="text-decoration: none">
    <h1 :style="{ 'font-size': fSize, 'line-height': 1 }">Unfollower</h1>
  </router-link>
</template>

<script>
export default {
  props: {
    xSmall: Boolean,
    small: Boolean,
  },
  computed: {
    fSize() {
      if (this.xSmall) return "40px";
      if (this.small) return "80px";
      return "130px";
    },
  },
};
</script>

<style scoped>
h1 {
  background: #f09433;
  background: linear-gradient(
    0deg,
    #fed373 4%,
    #f15245 30%,
    #d92e7f 62%,
    #9b36b7 85%,
    #515ecf
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
