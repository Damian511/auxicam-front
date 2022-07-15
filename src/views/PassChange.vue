<template>
    <v-app>
        <v-main>
            <v-container fluid fill-height>
                <v-layout justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-slide-y-transition>
                            <v-card class="elevation-24" min-width="50%">
                                <v-toolbar dark color="primary">
                                    <v-toolbar-title>CAMBIAR CONTRASEÑA</v-toolbar-title>
                                </v-toolbar>
                                <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="validate">
                                    <v-card-text>
                                        <v-text-field label="Contraseña Actual" prepend-icon="lock"
                                            :type="show1 ? 'text' : 'password'"
                                            :append-icon="show1 ? 'visibility' : 'visibility_off'"
                                            @click:append="show1 = !show1" :rules="passwordRules"
                                            v-model="form.old_pass">
                                        </v-text-field>

                                        <v-text-field label="Nueva Contraseña" prepend-icon="lock"
                                            :type="show2 ? 'text' : 'password'"
                                            :append-icon="show2 ? 'visibility' : 'visibility_off'"
                                            @click:append="show2 = !show2" :rules="passwordRules"
                                            v-model="form.new_pass">
                                        </v-text-field>

                                        <v-text-field label="Confirmar Contraseña" prepend-icon="lock"
                                            :type="show2 ? 'text' : 'password'"
                                            :append-icon="show3 ? 'visibility' : 'visibility_off'"
                                            @click:append="show3 = !show3"
                                            :rules="passwordRules.concat(passwordConfirmationRule)"
                                            v-model="form.confirm_pass">
                                        </v-text-field>
                                        <span v-if="error" class="red--text font-weight-black">{{ error }}</span>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" type="submit">CONFIRMAR</v-btn>
                                        <v-btn color="warning" @click="resetear">CANCELAR</v-btn>
                                    </v-card-actions>
                                </v-form>
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
    data() {
        return {
            //variable para validar formulario
            valid: true,
            show1: false,
            show2: false,
            show3: false,
            error: '',
            //reglas para el formulario
            passwordRules: [
                (v) => !!v || 'El campo es requerido',
                (v) => (v && v.length >= 6) || '6 caracteres mínimos',
            ],
            form: {
                old_pass: '',
                new_pass: '',
                confirm_pass: ''
            }
        }
    },
    computed: {
        passwordConfirmationRule() {
            return () => this.form.new_pass === this.form.confirm_pass || "Las contraseñas no coinciden";
        }
    },
    methods: {
        validate() {
            var validacion = this.$refs.form.validate()
            if (validacion != false) {
                this.cambiarPass()
            }
        },
        resetear() {
            this.$refs.form.reset();
        },
        cambiarPass() {
            User.cambiarPass(this.form, localStorage.user)
                .then(() => {
                    localStorage.removeItem("auth");
                    this.$router.push({ name: "Login" });
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.error = error.response.data.error
                    }
                })
        }

    }
}
</script>