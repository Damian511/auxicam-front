<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-select :items="dispositivos" item-text="mascota.nombre" v-model="selectDispositivo"
          item-value="dispositivoid" label="Selecciones un dispositivo" @change="getLocalizacionesDispositivos">
        </v-select>
      </v-col>
      <v-col cols="3">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
          min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="fechaInicio" label="Fecha Inicio" prepend-icon="mdi-calendar" readonly v-bind="attrs"
              v-on="on" clearable></v-text-field>
          </template>
          <v-date-picker v-model="fechaInicio" @input="menu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="3">
        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
          min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="fechaFin" label="Fecha Fin" prepend-icon="mdi-calendar" readonly v-bind="attrs"
              v-on="on" clearable></v-text-field>
          </template>
          <v-date-picker v-model="fechaFin" @input="menu2 = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-btn text class="mt-5 ml-n3" @click="buscar">
          Buscar
        </v-btn>
      </v-col>
    </v-row>
    <!--container-->
    <span class="headline">Historial de Localizaciones</span>
    <v-data-table v-if="table" :headers="headers" :header-props="headerProps" :items="items" :items-per-page="5"
      class="elevation-1">
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" class="white--text" @click="detalle(item)">Ubicación</v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-toolbar color="primary" class="white--text">Historial Ubicación
            <v-spacer></v-spacer>
            <v-icon color="white" @click="dialog = false">close</v-icon>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <GmapMap :center="{ lat: -25.4922182, lng: -57.4554114 }" :zoom="7" map-type-id="terrain"
            style="width: 550px; height: 250px">
            <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true"
              :draggable="true" @click="center = m.position" />
          </GmapMap>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      menu: false,
      menu2: false,
      fechaInicio: "",
      fechaFin: "",
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
    buscar() {
      if (this.selectDispositivo == '') {
        this.textSnack = "No puede busacr sin seleccionar al menos un dispositivo"
        this.snackbar = true
      } else {
        if (this.fechaInicio == '' || this.fechaFin == '') {
          this.textSnack = "Debe completar los campos fecha inicio y fecha fin"
          this.snackbar = true
        } else {
          this.getLocalizacionesDispositivos()
        }
      }

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
          console.log(this.dispositivos);
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    },
    getLocalizacionesDispositivos() {
      let url = "http://auxicam.ddnsking.com/auxicam-back/public/api/localizaciones";
      axios
        .get(url, {
          params: {
            dispositivoid: this.selectDispositivo,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin
          },
        })
        .then((response) => {
          this.items = response.data;
          this.table = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    detalle(item) {
      this.markers.push({
        position: {
          lat: parseFloat(item.latitud),
          lng: parseFloat(item.longitud),
        }
      })
      this.dialog = true;
    },
  },
};
</script>
