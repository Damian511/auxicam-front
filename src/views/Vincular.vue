<template>
  <div class="m-3">
    <span class="headline">Vincular Dispositivo</span>
    <v-row class="mt-1">
      <v-col cols="8" sm="6" md="3">
        <v-text-field
          v-model="sim"
          v-mask="'##########'"
          class="d-inline"
          label="Numero de Telefono"
          dense
          solo
          clearable
        ></v-text-field>
      </v-col>
      <v-btn dark color="primary d-inline mt-3" @click="consultarSim"
        >Vincular</v-btn
      >
    </v-row>
    <v-row>
      <v-col> 
        <v-alert type="error" dense v-model="alert">
           {{ textError }}
        </v-alert>
      </v-col>
    </v-row>
    
    <v-container v-if="verVinculacion" fill-height fluid>
      <v-row align="center" justify="center">
        <v-col cols="3" sm="1" class="ma-1">
          <v-icon size="100" color="red"> location_on </v-icon>
        </v-col>
        <v-col cols="3" sm="1" class="ml-5 mr-n7" v-if="mostrarCargando">
          <v-progress-circular
            indeterminate
            color="green"
            justify="center"
          ></v-progress-circular>
        </v-col>
        <v-col cols="3" sm="1" class="ma-1" v-if="mostrarOK">
          <v-icon size="70" color="green">done</v-icon>
        </v-col>
        <v-col cols="3" sm="1" class="ma-1" v-if="mostrarError">
          <v-icon size="70" color="red">close</v-icon>
        </v-col>
        <v-col cols="3" sm="1" class="ma-1 ml-n5">
          <v-icon size="100" color="blue">app_settings_alt</v-icon>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-alert type="success" dense v-if="mostrarOK">Vinculado Correctamente</v-alert>
        <v-alert type="error" dense v-else-if="mostrarError">No se pudo vincular</v-alert>
      </v-row>
    </v-container>
    <v-data-table :headers="headers" :items="dispositivos" :header-props="headerProps" v-if="verData">
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" class="white--text" @click="eliminar(item)">Eliminar</v-btn>
      </template>
    </v-data-table>
    <!--open dialog-->
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
      persistent
    >
      <v-card>
        <v-toolbar color="primary" dark
          >Datos de la Mascota <v-spacer></v-spacer>
          <v-icon @click="close">close</v-icon></v-toolbar
        >
        <v-card-text>
          <v-form ref="formPet">
            <v-text-field
              v-model="editemItem.Mascota"
              label="Nombre de la mascota"
              prepend-icon="pets"
            ></v-text-field>
            <v-text-field
              v-model="editemItem.Edad"
              type="number"
              max="20"
              label="Edad de la mascosta"
              prepend-icon="pets"
            ></v-text-field>
            <v-text-field
              v-model="editemItem.Raza"
              label="Raza de la mascosta"
              prepend-icon="pets"
            ></v-text-field>
            <v-text-field
              v-model="editemItem.Descripcion"
              label="Descripcion"
              prepend-icon="pets"
            ></v-text-field>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="green" class="white--text ma-1" @click="finalizar">Finalizar</v-btn>
              <v-btn color="red" class="white--text ma-1" @click="close"
                >Cerrar</v-btn
              >
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--pie de pagina-->
    <v-footer color="blue-grey darken-1" padless absolute>
      <v-row justify="center" no-gutters>
        <v-col
          class="blue-grey lighten-1 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} / <strong>AUXICAM - APP v0.1</strong>
        </v-col>
      </v-row>
    </v-footer>
    <v-snackbar
      v-model="snackbar"
    >
      {{ textSnack }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      mostrarOK: false,
      mostrarError: false,
      mostrarCargando: true,
      verVinculacion: false,
      verData: false,
      dialog: false,
      snackbar:false,
      alert:false,
      textError:'',
      textSnack:'',
      sim:'',
      simID:'',
      headerProps: {
        sortByText: "Filtrar por",
      },
      headers: [
        { text: "ID", value: "dispositivoid" },
        { text: "Mascota", value: "mascota.nombre" },
        { text: "Edad", value: "mascota.edad" },
        { text: "Raza", value: "mascota.raza" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Acciones", value: "actions" },
      ],
      editemItem:[
        { 
          Mascota:'',
          Edad:'',
          Raza:'',
          Descripcion:''
        }
      ],
      dispositivos:[]

    };
  },
  created(){
    this.getDispositivos();
  },
  methods: {
    getDispositivos(){
      let url ='http://auxicam.ddnsking.com/auxicam-back/public/api/dispositivosUsuarios'
      axios.get(url,{params:{
        "usuario" : localStorage.user
      }})
      .then(response=>{
        this.dispositivos = response.data
        this.verData = true
      }).catch(e=>{
        console.log(e.response.data)
      })
    },
    consultarSim(){
      let url = 'http://auxicam.ddnsking.com/auxicam-back/public/api/comprobarSIM'
      axios.get(url,{ params:{
        "sim": this.sim
      }}).then(response=>{
        if(response.data.value == true){
          this.alert = true
          this.textError = response.data.mensaje
        }else{
          this.alert = false
          this.simID = response.data.sim
          this.vincular()
        }
      }).catch(e=>{
        console.log(e.response.data)
      })
    },
    vincular() {
      this.verVinculacion = true
      this.mostrarCargando = true
      this.dialog = true
      this.mostrarError = false
      this.mostrarOK = false
    },
    altaVinculacion(){
      let url = 'http://auxicam.ddnsking.com/auxicam-back/public/api/altaDispositivo'
      let data = {
        "nombre" : this.editemItem.Mascota,
        "raza" : this.editemItem.Raza,
        "edad" : this.editemItem.Edad,
        "descripcion" : this.editemItem.Descripcion,
        "usuario" : localStorage.user,
        "simcardid" : this.simID
      }
      console.log(url,data)
      axios.post(url,data)
      .then(response=>{
        this.snackbar = true
        this.textSnack = response.data
        this.mostrarOK = true
        this.mostrarError = false
        this.mostrarCargando = false
        this.verData = true
        this.getDispositivos()
      }).catch(e=>{
        console.log(e.response.data)
      })
    },
    eliminarVinculacion(dispositivo_id){
      console.log(dispositivo_id)
    },
    close() {
      this.$refs.formPet.reset();
      this.dialog = false;
      this.mostrarError = true
      this.mostrarCargando = false
    },
    finalizar(){
      this.dialog = false;
      this.altaVinculacion()
    },
    eliminar(item){
      var r = confirm("Desea eliminar el registro")
      console.log(item)
      if(r){
        this.eliminarVinculacion(item.dispositivoid)
      }else{
        this.textSnack = "Se cancelo la operacion"
        this.snackbar = true
      }
    }
  },
};
</script>
