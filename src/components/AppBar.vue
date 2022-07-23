<template>
    <div>
        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list>
                <v-list-item class="px-2">
                    <v-avatar color="blue-grey darken-1" class="mx-auto">
                        <v-icon dark> person </v-icon>
                    </v-avatar>
                </v-list-item>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-list-item @click="dialog = true" v-bind="attrs" v-on="on">
                            <v-list-item-content class="text-center">
                                <v-list-item-title class="text-h6">Bienvenido</v-list-item-title>
                                <v-list-item-subtitle>{{ user.name }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <span>Editar Datos</span>
                </v-tooltip>
            </v-list>
            <v-container class="mt-n2" v-if="user.pass_default == true">
                <v-alert dense type="error">
                    <router-link class="text-decoration-none white--text" to="/passChange">Cambiar contraseña
                    </router-link>
                </v-alert>
            </v-container>
            <v-divider></v-divider>
            <v-list>
                <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="primary">
            <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title class="white--text">AUXICAM - APP</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn text class="white--text" @click="logout"> Salir </v-btn>
        </v-app-bar>
        <v-dialog v-model="dialog" persistent max-width="80%">
            <v-card>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title class="text-h6 font-weight-regular justify-space-between primary">
                        <span class="white--text">Datos del Usuario</span>
                        <v-btn icon @click="dialog = false">
                            <v-icon color="white"> close </v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="user.name" prepend-icon="person" label="Nombres"
                                        :rules="defaultRules"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="user.telefono" prepend-icon="phone" label="N° Celular"
                                        v-maska="'(####)###-###'" :rules="defaultRules"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="user.direccion" prepend-icon="home" label="Direccion"
                                        :rules="defaultRules"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                        transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="user.fechanacimiento" label="Fecha de Nacimiento"
                                                prepend-icon="event" readonly v-bind="attrs" v-on="on"
                                                :rules="defaultRules">
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="user.fechanacimiento" @input="menu = false" locale="es"
                                            min="1950-01-01" :active-picker.sync="activePicker"
                                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)">
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" text @click="close">
                            Cancelar
                        </v-btn>
                        <v-btn color="green darken-1" text @click.prevent="validate">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import User from "@/apis/User";
export default {
    data() {
        return {
            activePicker: '',
            menu: false,
            defaultRules: [
                (v) => !!v || "El campo es obligatorio",
            ],
            valid: false,
            dialog: false,
            isLoggedIn: false,
            drawer: false,
            items: [
                { title: "Inicio", icon: "home", link: "/" },
                { title: "Vincular", icon: "sync", link: "/vincular" },
                { title: "Historial", icon: "history", link: "/historial" },
            ],
            user: "",
        };
    },
    watch: {
        menu(val) {
            val && setTimeout(() => (this.activePicker = 'YEAR'))
        },
    },
    mounted() {
        this.$root.$on("login", () => {
            this.isLoggedIn = true;
        });
        this.isLoggedIn = !!localStorage.getItem("auth");
        this.setUser();
    },
    methods: {
        logout() {
            User.logout().then(() => {
                localStorage.removeItem("auth");
                localStorage.removeItem("user");
                this.isLoggedIn = false;
                this.$router.push({ name: "Login" });
            });
        },
        setUser() {
            User.auth()
                .then((response) => {
                    this.user = response.data;
                })
                .catch();
        },
        editUsuario() {
            User.updateUsuario(this.user, this.user.id)
                .then(() => {
                    this.setUser()
                    this.close()
                }).catch()
        },
        validate() {
            var validacion = this.$refs.form.validate();
            if (validacion != false) {
                this.editUsuario()
            }
        },
        close() {
            this.dialog = false;
        },
    },
};
</script>