<template>
    <div class="m-3">
        <v-card outlined>
            <v-card-title>Cambiar contraseña por defecto</v-card-title>
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="validar">
                <v-card-text>
                    <v-text-field label="Contraseña Actual" prepend-icon="lock" :type="show1 ? 'text' : 'password'"
                        :append-icon="show1 ? 'visibility' : 'visibility_off'" @click:append="show1 = !show1"
                        :rules="passwordRules" v-model="form.old_pass">
                    </v-text-field>

                    <v-text-field label="Nueva Contraseña" prepend-icon="lock" :type="show2 ? 'text' : 'password'"
                        :append-icon="show2 ? 'visibility' : 'visibility_off'" @click:append="show2 = !show2"
                        :rules="passwordRules" v-model="form.new_pass">
                    </v-text-field>

                    <v-text-field label="Confirmar Contraseña" prepend-icon="lock" :type="show2 ? 'text' : 'password'"
                        :append-icon="show3 ? 'visibility' : 'visibility_off'" @click:append="show3 = !show3"
                        :rules="passwordRules.concat(passwordConfirmationRule)" v-model="form.confirm_pass">
                    </v-text-field>
                    <span v-if="error" class="red--text font-weight-black">{{ error }}</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.prevent="validate">CONFIRMAR</v-btn>
                    <v-btn color="warning" @click="resetear">CANCELAR</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
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
                    this.$router.push({ name: "Dashboard" });
/*                     User.logout().then(() => {
                        location.reload()
/*                         localStorage.removeItem("auth");
                        this.isLoggedIn = false;
                        this.$router.push({ name: "Login" }); 
                    }) */
                }).catch(error => {
                    if (error.response.status === 422) {
                        this.error = error.response.data.error
                    }
                })
        }

    }
}
</script>