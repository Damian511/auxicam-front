<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md4>
            <v-slide-y-transition>
              <v-card class="elevation-4">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>REGISTRAR USUARIO</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form
                    ref="login"
                    v-model="valid"
                    lazy-validation
                    @submit.prevent="validar"
                  >
                    <v-text-field
                      v-model="nombre"
                      prepend-icon="person"
                      label="Nombre y Apellido"
                      type="text"
                      :rules="defaultRules"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="usuario"
                      prepend-icon="account_circle"
                      label="Nombre de Usuario"
                      :rules="defaultRules"
                      required
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="correo"
                      prepend-icon="email"
                      label="Correo Eléctronico"
                      :rules="emailRules"
                      required
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="password"
                      id="password"
                      prepend-icon="lock"
                      :append-icon="showPass ? 'visibility' : 'visibility_off'"
                      label="Contraseña"
                      :type="showPass ? 'text' : 'password'"
                      :rules="defaultRules"
                      @click:append="showPass = !showPass"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="passwordConfirm"
                      id="password"
                      prepend-icon="lock"
                      :append-icon="showRePass ? 'visibility' : 'visibility_off'"
                      label="Confirmar Contraseña"
                      :type="showRePass ? 'text' : 'password'"
                      :rules="defaultRules.concat(passwordConfirmationRule)"
                      @click:append="showRePass = !showRePass"
                      required
                    ></v-text-field>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        type="submit"
                        class="ma-2"
                        justify-space-between
                      >REGISTRAR</v-btn
                      >
                      <v-btn color="warning" class="ma-2" @click="resetear"
                        >LIMPIAR</v-btn
                      >
                    </v-row>
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
export default {
  data: () => ({
    //reglas para el formulario
    defaultRules: [(v) => !!v || "El campo es requerido"],
    emailRules: [
      (v) => !!v || "El campo email es requerido",
      (v) => /.+@.+\..+/.test(v) || "E-mail no válido",
    ],
    //variables para show password
    showPass: false,
    showRePass: false,
    //variable para validar formulario
    valid: true,
    nombre: '',
    usuario: '',
    correo: '',
    password: '',
    passwordConfirm: '',
  }),
  props: {
    source: String,
  },
  computed: {
    passwordConfirmationRule() {
      return () => this.password === this.passwordConfirm || "Las contraseñas no coinciden";
    },
  },
  methods: {
    validar() {},
    resetear() {
      this.$refs.login.reset();
      this.showPass = false;
      this.showRePass = false;
    },
  },
};
</script>
