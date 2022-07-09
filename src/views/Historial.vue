<template>
  <div class="m-3">
    <v-card outlined elevation="3">
      <v-card-title>Historial de Ubicaciones</v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="validar">
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-select :items="dispositivos" item-text="descripcion" item-value="dispositivoid"
                v-model="selectDispositivo" label="Selecciones un dispositivo" :rules="defaultRules">
              </v-select>
            </v-col>
            <v-col cols="3">
              <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="fecha" label="Fecha Inicio" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                    v-on="on" clearable :rules="defaultRules"></v-text-field>
                </template>
                <v-date-picker v-model="fecha" @input="menu = false" locale="es"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                :return-value.sync="horaInicio" transition="scale-transition" offset-y max-width="290px"
                min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="horaInicio" label="Hora Inicio" prepend-icon="schedule" readonly v-bind="attrs"
                    v-on="on" :rules="defaultRules"></v-text-field>
                </template>
                <v-time-picker v-if="menu2" v-model="horaInicio" full-width
                  @click:minute="$refs.menu2.save(horaInicio)">
                </v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="3">
              <v-menu ref="menu3" v-model="menu3" :close-on-content-click="false" :nudge-right="40"
                :return-value.sync="horaFin" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="horaFin" label="Hora Fin" prepend-icon="schedule" readonly v-bind="attrs"
                    v-on="on" :rules="defaultRules"></v-text-field>
                </template>
                <v-time-picker v-if="menu3" v-model="horaFin" full-width @click:minute="$refs.menu3.save(horaFin)">
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="primary" block @click.prevent="validate">BUSCAR</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-card outlined elevation="3" class="mt-2">
      <v-card-title>Localizaciones</v-card-title>
      <v-card-text>
        <div style="height: 500px; width: 95%;margin-left: 1%">
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

    <!--pie de pagina-->
    <v-footer color="blue-grey darken-1" padless absolute>
      <v-row justify="center" no-gutters>
        <v-col class="blue-grey lighten-1 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} / <strong>AUXICAM - APP v0.1</strong>
        </v-col>
      </v-row>
    </v-footer>
    <v-snackbar v-model="snackbar">
      {{ textSnack }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
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

//import Mapa from "@/components/AddGoogleMap.vue";
export default {
  components: {
    //Mapa,
    LMap,
    LTileLayer,
    LPolyline,
    LMarker,
    LIcon
  },
  data() {
    return {
      cargar:false,
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
      markerLatLng:[],
      //reglas para el formulario
      defaultRules: [(v) => !!v || "El campo es requerido"],
      //variable para validar formulario
      valid: true,
      menu: false,
      menu2: false,
      menu3: false,
      //variable para cargar el select
      dispositivos: [],
      selectDispositivo: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
      table: false,
      dialog: false,
      dispositivos: [],
      selectDispositivo: "",
      snackbar: false,
      textSnack: "",
      markers: [],
      headerProps: {
        sortByText: "Filtrar por",
      },
      headers: [
        { text: "Dispositivo ID", value: "dispositivoid" },
        { text: "Fecha y Hora", value: "fechahora" },
        { text: "Latitud", value: "latitud" },
        { text: "Longitud", value: "longitud" },
        { text: "Bateria", value: "bateria" },
        { text: "Ver", value: "actions" },
      ],
      items: [],
    };
  },
  created() {
    //this.getLocalizaciones()
    this.getDispositivos();
  },
  methods: {
    getDispositivos() {
      User.dispositivosUsuario(localStorage.user)
        .then((response) => {
          this.dispositivos = response.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    validate() {
      var validacion = this.$refs.form.validate()
      if (validacion != false) {
        this.getHistorico();
      }
    },

    buscar() {
      if (this.selectDispositivo == "") {
        this.textSnack =
          "No puede busacr sin seleccionar al menos un dispositivo";
        this.snackbar = true;
      } else {
        if (this.fechaInicio == "" || this.fechaFin == "") {
          this.textSnack = "Debe completar los campos fecha inicio y fecha fin";
          this.snackbar = true;
        } else {
          this.getLocalizacionesDispositivos();
        }
      }
    },

    getHistorico() {
      let data = {
        "dispositivoid" : this.selectDispositivo,
        "fecha" : this.fecha,
        "horaInicio" : this.horaInicio,
        "horaFin" :  this.horaFin
      }
      User.obtenerHistorico(data)
      .then(response=>{
        console.log(response)
        this.center = response.data[0]
        this.polyline.latlngs = response.data
        this.markerLatLng = response.data[response.data.length-1]
        this.cargar = true
      }).catch()
    },

  },
};
</script>
