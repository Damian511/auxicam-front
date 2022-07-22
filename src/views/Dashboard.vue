<template>
  <div class="m-3">
    <v-card outlined elevation="3">
      <v-card-title>Localizar Dispositivo</v-card-title>
      <v-card-text>
        <v-col>
          <v-select :items="dispositivos" item-text="descripcion" item-value="dispositivoid" v-model="selectDispositivo"
            label="Seleccione un dispositivo vinculado" @change="getLocalizaciones">
          </v-select>
        </v-col>
      </v-card-text>
      <v-card-actions v-if="cargar">
        <v-btn block color="primary" @click="getEstadoDispositivo">VER ESTADO DEL DISPOSITIVO</v-btn>
      </v-card-actions>
    </v-card>

    <v-card outlined elevation="3" class="mt-2">
      <v-card-title>Localizaciones {{status}}</v-card-title>
      <v-card-subtitle class="blue--text" v-if="gps == '' && cargar == true">Obteniendo información del gps</v-card-subtitle>
      <v-card-subtitle class="green--text" v-else-if="gps == 'GPS está activo'">{{gps}} </v-card-subtitle>
      <v-card-subtitle class="red--text" v-else>{{gps}} </v-card-subtitle>
      <v-card-text>
        <v-alert dense type="warning" v-if="noData">No hay datos de localizaciones del dispositivo seleccionado</v-alert>
        <div style="height: 440px; width: 95%; margin-left: 1%">
          <l-map style="height: 80%" :zoom="zoom" :center="center" v-if="cargar">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>
            <l-marker :lat-lng="markerLatLng"> </l-marker>
          </l-map>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="verEstado" persistent max-width="50%">
      <v-card>
        <v-card-title class="text-h6 font-weight-regular justify-space-between primary">
          <span class="white--text">Estado del Dispositivo</span>
          <v-btn icon @click="verEstado = false">
            <v-icon color="white"> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <span class="font-weight-medium subtitle-1">ID Dispositivo:
              </span>
              <span> {{ estado.dispositivoid }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="font-weight-medium subtitle-1">Nivel Batería: </span>
              <span> {{ estado.bateria }} %</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import User from "../apis/User";
import { LMap, LTileLayer, LPolyline, LMarker, LIcon } from "vue2-leaflet";
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LMarker,
    LIcon,
  },
  data() {
    return {
      status:'',
      noData:false,
      gps:'',
      dialog: false,
      user: null,
      date: null,
      cargar: false,
      dispositivos: [],
      selectDispositivo: "",
      //variables para el mapa
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 16,
      //center: [-25.468671988081482, -57.42948006701373],
      center: [],
      polyline: {
        //latlngs: [[-25.468535,-57.429403], [-25.468117,-57.429185], [-25.468349,-57.428549]],
        latlngs: [],
        color: "#19BAF1",
      },
      //markerLatLng:[-25.468349,-57.428549]
      markerLatLng: [],
      estado: [],
      verEstado: false
    };
  },
  created() {
    this.getDispositivos();
    this.socketGPS();
    this.socketStatus();
  },
  methods: {
    socketLocation() {
      window.Echo.channel("channel-location").listen("NewLocation", (response) => {
        if(this.noData == true){
          this.noData = false
          this.center = response.location[0]
          this.polyline.latlngs.push(response.location[0]);
          this.markerLatLng = response.location[0];
          this.cargar = true
        }else{
          this.center = response.location[0]
          this.polyline.latlngs.push(response.location[0]);
          this.markerLatLng = response.location[0];
          this.cargar = true
        }
      });
    },
    socketGPS() {
      window.Echo.channel("channel-gps").listen("GpsStatus", (response) => {
        this.gps = response.status
      });
    },
    socketStatus(){
      window.Echo.channel("channel-dispositivo").listen("DispositivoStatus", (response) => {
        console.log(response.message)
      });
    },
    getDispositivos() {
      User.dispositivosUsuario(localStorage.user)
        .then((response) => {
          this.dispositivos = response.data;
          this.socketLocation();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    getLocalizaciones() {
      User.obtenerLocalizaciones(this.selectDispositivo)
        .then((response) => {
          if(response.data.length == 0){
            this.noData = true;
          }else{
            this.center = response.data[0];
            this.polyline.latlngs = response.data;
            this.markerLatLng = response.data[response.data.length - 1];
            this.noData = false
            this.cargar = true;
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    getEstadoDispositivo() {
      User.verEstado(this.selectDispositivo)
        .then((response) => {
          this.estado = response.data;
          this.verEstado = true
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
};
</script>
