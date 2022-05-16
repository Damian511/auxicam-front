<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app temporary absolute>
      <v-list>
        <v-list-item class="px-2">
          <v-avatar color="blue-grey darken-1" class="mx-auto">
            <v-icon dark> person </v-icon>
          </v-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="text-center">
            <v-list-item-title class="text-h6">Bienvenido {{user.name}}</v-list-item-title>
            <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout"> Salir </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" v-if="isLoggedIn">
      <v-app-bar-nav-icon
        color="white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="white--text">AUXICAM - APP</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link class="text-decoration-none" to="/login" v-if="!isLoggedIn">
        <v-btn text class="white--text"> Login </v-btn>
      </router-link>

      <v-btn v-if="isLoggedIn" text class="white--text" @click="logout">
        Salir
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import User from "./apis/User";
export default {
  data() {
    return {
      isLoggedIn: false,
      drawer: false,
      items: [
        { title: "Inicio", icon: "home", link: "/dashboard" },
        { title: "Vincular", icon: "sync", link: "/vincular" },
        { title: "Historial", icon: "history", link: "/historial" },
      ],
      user:''
    };
  },
  mounted() {
    this.$root.$on("login", () => {
      this.isLoggedIn = true;
    });
    this.isLoggedIn = !!localStorage.getItem("auth");
    User.auth().then(response => {
      this.user = response.data;
    });
  },
  methods: {
    logout() {
      User.logout().then(() => {
        localStorage.removeItem("auth");
        this.isLoggedIn = false;
        this.$router.push({ name: "Login" });
      });
    },
    
  },
};
</script>