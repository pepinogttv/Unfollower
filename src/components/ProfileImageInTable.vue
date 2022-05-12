<template>
  <div>
    <a :href="image_in_base64" download ref="download"></a>
    <v-hover v-slot="{ hover }">
      <v-avatar size="40" class="elevation-2">
        <div v-if="hover" class="download" @click="download">
          <v-icon color="black">mdi-download</v-icon>
        </div>
        <v-img :src="image_in_base64">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                size="25"
                width="2"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-avatar>
    </v-hover>
  </div>
</template>

<script>
import Api from "../services/Api";
export default {
  props: {
    profile_pic_url: String,
    user: Object,
  },
  data: () => ({
    image_in_base64: "",
  }),
  async created() {
    if (this.user.image_in_base64) {
      this.image_in_base64 = this.user.image_in_base64;
      return;
    }
    const res = await Api.downloadProfileImage(this.profile_pic_url);
    if (res.status === "success") {
      this.user.image_in_base64 = res.data;
      this.image_in_base64 = res.data;
    }
  },
  methods: {
    download() {
      this.$refs.download.click();
    },
  },
};
</script>

<style>
.download {
  background-color: rgba(255, 255, 255, 0.6);
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 2;
  cursor: pointer;
  animation: opacity 0.2s forwards;
}

@keyframes opacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
