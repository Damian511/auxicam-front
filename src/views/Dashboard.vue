<template>
  <div class="m-3">
    <v-card outlined elevation="3">
      <v-card-title>Localizar Dispositivo</v-card-title>
      <v-card-text>
        <v-col cols="4">
          <v-select :items="dispositivos" item-text="descripcion" item-value="dispositivoid"
            v-model="selectDispositivo" label="Selecciones un dispositivo" @change="getLocalizaciones">
          </v-select>
        </v-col>
      </v-card-text>
    </v-card>

    <v-card outlined elevation="3" class="mt-2">
      <v-card-title>Localizaciones</v-card-title>
      <v-card-text>
        <Mapa></Mapa>
      </v-card-text>
    </v-card>


    <v-footer color="blue-grey darken-1" padless absolute>
      <v-row justify="center" no-gutters>
        <v-btn color="white" text class="my-2" @click="dialog = true">Estado del Dispositivo</v-btn>
        <v-col class="blue-grey lighten-1 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} / <strong>AUXICAM - APP v0.1</strong>
        </v-col>
      </v-row>
    </v-footer>
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600" persistent>
      <v-card>
        <v-toolbar color="primary" dark>Estado Dispositivo</v-toolbar>
        <v-card-text>
          <v-row class="mt-1">
            <v-col>
              <v-alert type="warning" dense v-if="selectDispositivo == ''">Seleccione un dispositivo para ver el estado
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="font-weight-medium subtitle-1">ID Dispositivo:
              </span>
              <span> </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="font-weight-medium subtitle-1">Nivel Batería: </span>
              <span> %</span>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cerrar</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import User from "../apis/User";
import Mapa from "../components/Mapa.vue";
export default {
  components: {
    Mapa,
  },
  data() {
    return {
      dialog: false,
      user: null,
      date: null,
      dispositivos: []
    };
  },
  created() {
    User.auth().then((response) => {
      this.user = response.data;
    });
    this.getDispositivos();
  },
  methods:{
    getDispositivos() {
      User.dispositivosUsuario(localStorage.user)
        .then(response => {
          this.dispositivos = response.data
        }).catch(error => {
          console.log(error.response.data)
        })
    },
  }
};
</script>
