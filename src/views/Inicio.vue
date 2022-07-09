<template>
  <v-container fluid>
    <span class="headline">Localizar Dispositivo</span>
    <v-col cols="4">
      <v-select :items="dispositivos" item-text="mascota.nombre" item-value="dispositivoid" v-model="selectDispositivo"
        label="Selecciones un dispositivo" @change="getLocalizaciones">
      </v-select>
      {{ posicion }}
    </v-col>
    <GmapMap :center="{ lat: -25.4922182, lng: -57.4554114 }" :zoom="7" map-type-id="terrain"
      style="width: 800px; height: 250px">
      <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true"
        @click="center = m.position" />
    </GmapMap>
    <!-- <Mapa class="mapa" v-if="selectDispositivo != ''"/> -->
    <v-footer color="blue-grey darken-1" padless absolute>
      <v-row justify="center" no-gutters>
        <!--<v-btn color="white" text class="my-2">Ver Ubicación</v-btn>
        <v-btn color="white" text class="my-2">Actualizar</v-btn>-->
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
              <span> {{ items.dispositivoid }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="font-weight-medium subtitle-1">Nivel Batería: </span>
              <span> {{ items.bateria }} %</span>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cerrar</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
//import Mapa from "@/components/AddGoogleMap.vue";
export default {
  components: {
    //Mapa,
  },
  data() {
    return {
      dialog: false,
      dispositivos: [],
      selectDispositivo: "",
      items: [],
      markers: [],
      posicion: [],
    };
  },
  created() {
    this.getDispositivos();
  },
  methods: {
    getLocalizaciones() {
      let url = "http://auxicam.ddnsking.com/auxicam-back/public/api/marcadores";
      axios
        .get(url, {
          params: {
            dispositivoid: this.selectDispositivo,
          },
        })
        .then((response) => {
          console.log(response.data)
          this.markers = response.data;
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    },
    getMarcador() {
      let url = "hhttp://localhost/auxicam-back/public/api/localizaciones";
      axios
        .get(url)
        .then((response) => {
          this.posicion = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getEstado() {
      let url = "http://auxicam.ddnsking.com/auxicam-back/public/api/verEstado";
      axios
        .get(url, {
          params: {
            dispositivoid: this.selectDispositivo,
          },
        })
        .then((response) => {
          this.items = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getDispositivos() {
      let url = "http://auxicam.ddnsking.com/auxicam-back/public/api/dispositivosUsuarios";
      axios
        .get(url, {
          params: {
            usuario: localStorage.user,
          },
        })
        .then((response) => {
          this.dispositivos = response.data;
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mapa {
  height: 100%;
}
</style>
