<template>
  <v-app id="inspire">
    <v-main>
      <v-banner v-if="deferredPrompt" color="primary" dark class="text-left">
          Obtenga nuestra aplicación gratuita. ¡No ocupará espacio en su teléfono!
        <template v-slot:actions>
          <v-btn text @click="dismiss">Cancelar</v-btn>
          <v-btn text @click="install">Instalar</v-btn>
        </template>
      </v-banner>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      deferredPrompt: null
    }
  },
  created() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  methods: {
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    }
  },
};
</script>