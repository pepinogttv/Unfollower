<template>
  <v-form @submit.prevent="signin" class="pa-6 white" ref="form">
    <v-snackbar v-model="snackbarError">
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
    <div class="text-h4 font-weight-light">Iniciar sesion</div>
    <div class="mb-6 font-weight-light subtitle-2">
      Tus credenciales son unicamente para el uso de la aplicacion. <br />
      <div class="error--text font-weight-bold">
        TU CLAVE NO SE QUEDARA GUARDADA.
      </div>
    </div>
    <div>
      <div class="d-flex flex-column">
        <v-text-field
          outlined
          hide-details
          label="Usuario de instagram"
          v-model="username"
        ></v-text-field>
        <div class="mb-4"></div>
        <v-text-field
          outlined
          hide-details
          label="Clave de instagram"
          :type="passwordFieldType"
          v-model="password"
          :append-icon="passwordAppendIcon"
          @click:append="togglePasswordType"
        ></v-text-field>
      </div>
    </div>
    <v-checkbox
      label="Mantener sesion (No se guarda tu clave)"
      class="mt-8"
    ></v-checkbox>
    <v-btn
      color="secondary"
      type="submit"
      :disabled="!username || !password"
      :loading="loading"
    >
      Iniciar sesion
    </v-btn>
  </v-form>
</template>

<script>
// import storage from "../services/storage";
import { signin } from "../services/Common";
import { get } from "vuex-pathify";

export default {
  data() {
    return {
      passwordAppendIcon: "mdi-eye",
      passwordFieldType: "password",
      username: "",
      password: "",
      las_update: "",
      loading: false,
      errorMessage: "",
      snackbarError: false,
    };
  },
  methods: {
    togglePasswordType() {
      if (this.passwordFieldType === "password")
        this.passwordFieldType = "text";
      else this.passwordFieldType = "password";

      if (this.passwordAppendIcon === "mdi-eye")
        this.passwordAppendIcon = "mdi-eye-off";
      else this.passwordAppendIcon = "mdi-eye";
    },
    async signin() {
      this.loading = true;

      const { username, password } = this;
      const credentials = { username, password };
      const { error, data } = await signin(credentials);
      if (error) {
        this.snackbarError = true;
        this.errorMessage = error;
      } else {
        this.$store.set("account", {
          account: data,
          keep: true,
        });
        this.$emit("logged-in");
        this.$refs.form.reset();
      }
      this.loading = false;
    },
  },
  computed: {
    isValid() {
      return this.username && this.password;
    },
    accounts: get("accounts"),
  },
};
</script>

<style></style>
