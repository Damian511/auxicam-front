<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md4>
            <v-slide-y-transition>
              <v-card class="elevation-24" min-width="600">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>INICIAR SESIÓN</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form
                    ref="login"
                    v-model="valid"
                    lazy-validation
                    @submit.prevent="validar"
                  >
                    <v-text-field
                      v-model="form.email"
                      prepend-icon="person"
                      name="login"
                      label="Correo Electronico"
                      type="text"
                      :rules="defaultRules"
                      required
                      autocomplete="off"
                    ></v-text-field>
                    <span class="text-danger" v-if="errors.email">
                      {{ errors.email[0] }}
                    </span>
                    <v-text-field
                      v-model="form.password"
                      id="password"
                      prepend-icon="lock"
                      name="password"
                      label="Contraseña"
                      type="password"
                      :rules="defaultRules"
                      required
                      autocomplete="off"
                    ></v-text-field>
                    <span class="text-danger" v-if="errors.password">
                      {{ errors.password[0] }}
                    </span>
                    <v-row>
                      <v-col>
                        <span class="font-italic"
                          >Aún no tiene una cuenta?
                        </span>
                        <span class="font-weight-bold">
                          Contacte con un Administrador</span
                        >
                      </v-col>
                    </v-row>
                      <v-spacer></v-spacer>
                        <v-btn
                        block
                          color="primary"
                          type="submit"
                          class="ma-2"
                          justify-space-between
                          >INGRESAR</v-btn
                        >
                        <v-btn block color="warning" class="ma-2" @click="resetear"
                          >LIMPIAR</v-btn
                        >
                  </v-form>
                </v-card-text>
              </v-card>
            </v-slide-y-transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import User from "../apis/User";

export default {
  data: () => ({
    //variables para guardar el formulario
    form: {
      email: "",
      password: "",
    },
    errors: [],
    //reglas para el formulario
    defaultRules: [(v) => !!v || "El campo es requerido"],
    //variable para validar formulario
    valid: false,
  }),
  props: {
    source: String,
  },
  methods: {
    validar() {
      var validacion = this.$refs.login.validate();
      if (validacion != false) {
        this.login();
      }
    },
    resetear() {
      this.$refs.login.reset();
      this.errors = [];
    },
    login() {
      User.login(this.form)
        .then(() => {
          this.$root.$emit("login", true);
          localStorage.setItem("auth", "true");
          this.$router.push({ name: "Dashboard" });
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors;
          }
        });
    },
  },
};
</script>
