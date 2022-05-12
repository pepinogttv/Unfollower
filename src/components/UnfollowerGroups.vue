<template>
  <div class="pa-8">
    <v-row>
      <v-col
        cols="6"
        v-for="({ name, info, groupName, actions }, i) of groups"
        :key="i"
      >
        <v-card
          :to="`/groups/${groupName}`"
          link
          :disabled="disabled || loading"
          height="100%"
          width="100%"
          elevation="0"
          hover
          class="pb-3 px-3"
        >
          <div class="moreInfo">
            <v-tooltip bottom v-if="info">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="#ccc" v-bind="attrs" v-on="on">
                  mdi-help-circle
                </v-icon>
              </template>
              <span>{{ info }}</span>
            </v-tooltip>
          </div>
          <div class="font-weight-light pt-3" style="font-size: 28px">
            {{ name }}
          </div>
          <div class="font-weight-medium" style="font-size: 28px">
            <slot :name="groupName"></slot>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    loading: Boolean,
  },
  data: () => ({
    groups: [
      {
        name: "Seguidores",
        groupName: "followers",
        info: "Usuarios que te siguen.",
      },
      {
        name: "Seguidos",
        groupName: "following",
        info: "Usuarios que sigues.",
      },
      {
        name: "No los seguis",
        groupName: "fans",
        info: "Usuarios que te siguen y vos no seguis.",
      },
      {
        name: "No te siguen",
        groupName: "idols",
        info: "Usuarios que sigues y no te siguen.",
      },
      {
        name: "Se siguen",
        groupName: "friends",
        info: "Lo sigues y te sigue.",
      },
      {
        name: "Te dejaron de seguir",
        groupName: "idols",
        info: "Usuarios que sigues y no te siguen.",
      },
      {
        name: "Te empezaron a seguir",
        groupName: "friends",
        info: "Lo sigues y te sigue.",
      },
    ],
  }),
};
</script>

<style>
.moreInfo {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
