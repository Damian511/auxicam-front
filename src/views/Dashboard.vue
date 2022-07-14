<template>
  <div class="m-3">
    <v-card outlined elevation="3">
      <v-card-title>Localizar Dispositivo</v-card-title>
      <v-card-text>
        <v-col cols="4">
          <v-select :items="dispositivos" item-text="descripcion" item-value="dispositivoid" v-model="selectDispositivo"
            label="Selecciones un dispositivo" @change="getLocalizaciones">
          </v-select>
        </v-col>
      </v-card-text>
    </v-card>

    <v-card outlined elevation="3" class="mt-2">
      <v-card-title>Localizaciones</v-card-title>
      <v-card-text>
        <div style="height: 450px; width: 95%;margin-left: 1%">
          <l-map style="height: 80%" :zoom="zoom" :center="center" v-if="cargar">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>
            <l-marker :lat-lng="markerLatLng">
            </l-marker>
          </l-map>
        </div>
        <!--         <Mapa></Mapa> -->
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
import { LMap, LTileLayer, LPolyline, LMarker, LIcon} from 'vue2-leaflet';
import { Icon } from 'leaflet';


delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/* import Mapa from "../components/Mapa.vue"; */
export default {
  /*   components: {
      Mapa,
    }, */
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LMarker,
    LIcon
  },
  data() {
    return {
      dialog: false,
      user: null,
      date: null,
      cargar:false,
      dispositivos: [],
      selectDispositivo:'',
      //variables para el mapa
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 16,
      //center: [-25.468671988081482, -57.42948006701373],
      center:[],
      polyline: {
        //latlngs: [[-25.468535,-57.429403], [-25.468117,-57.429185], [-25.468349,-57.428549]],
        latlngs:[],
        color: 'red'
      },
      //markerLatLng:[-25.468349,-57.428549]
      markerLatLng:[]
    };
  },
  created() {
    this.getDispositivos();
  },
  methods: {
    socket(){
      window.Echo.channel('channel')
        .listen('NewLocation',(response)=>{
          this.markerLatLng = response.location[0]
          this.polyline.latlngs.push(response.location[0])
      })
    },
    getDispositivos() {
      User.dispositivosUsuario(localStorage.user)
        .then(response => {
          this.dispositivos = response.data
          this.socket()
        }).catch(error => {
          console.log(error.response.data)
        })
    },
    getLocalizaciones() {
      User.obtenerLocalizaciones(this.selectDispositivo)
      .then(response=>{
        this.center = response.data[0]
        this.polyline.latlngs = response.data
        this.markerLatLng = response.data[response.data.length-1]
        this.cargar = true
      }).catch(error=>{
        console.log(error.response.data) 
      })
    }
  }
};
</script>
