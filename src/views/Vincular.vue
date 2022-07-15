<template>
  <div class="m-3">
    <v-card outlined elevation="3">
      <v-card-title>Vincular Dispositivo</v-card-title>
      <v-card-text>
        <v-text-field v-model="data.numero" v-maska="'(####)###-###'" class="d-inline" label="Numero de Telefono" dense
          solo clearable></v-text-field>
        <v-alert type="error" dense v-model="alert" class="mt-n3">
          {{ textError }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark color="primary" block @click="comprobarSIM">Vincular</v-btn>
      </v-card-actions>
    </v-card>
    
    <v-card outlined elevation="3" class="mt-2">
      <v-card-title>Dispositivos Vinculados</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="dispositivos" :header-props="headerProps" v-if="verData">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="primary" class="white--text" @click="eliminar(item)">Eliminar</v-btn>
          </template>
          <template v-slot:no-data>
            <span>No hay datos que mostrar</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-container v-if="verVinculacion" fill-height fluid>
      <v-row align="center" justify="center">
        <v-col cols="3" sm="1" class="ma-1">
          <v-icon size="100" color="red"> location_on </v-icon>
        </v-col>
        <v-col cols="3" sm="1" class="ml-5 mr-n7" v-if="mostrarCargando">
          <v-progress-circular indeterminate color="green" justify="center"></v-progress-circular>
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



    <!--open dialog-->
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600" persistent>
      <v-card>
        <v-toolbar color="primary" dark>Datos de la Mascota <v-spacer></v-spacer>
          <v-icon @click="close">close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formPet" lazy-validation v-model="valid">
            <v-text-field v-model="editemItem.nombre" label="Nombre de la mascota" prepend-icon="pets"
              :rules="defaultRules"></v-text-field>
            <v-text-field v-model="editemItem.edad" v-maska="'##'" label="Edad de la mascosta" prepend-icon="pets"
              :rules="defaultRules"></v-text-field>
            <v-text-field v-model="editemItem.raza" label="Raza de la mascosta" prepend-icon="pets"
              :rules="defaultRules"></v-text-field>
            <v-text-field v-model="editemItem.descripcion" label="Tag Dispositivo" prepend-icon="sell"
              :rules="defaultRules"></v-text-field>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="green" class="white--text ma-1" @click.prevent="validate">Finalizar</v-btn>
              <v-btn color="red" class="white--text ma-1" @click="close">Cerrar</v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

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
export default {
  data() {
    return {
      //validacion de formulario
      valid: false,
      //reglas para el formulario
      defaultRules: [(v) => !!v || "El campo es requerido"],
      //variables para mostrar ocultar elementos
      mostrarOK: false,
      mostrarError: false,
      mostrarCargando: true,
      verVinculacion: false,
      verData: true,
      dialog: false,
      snackbar: false,
      alert: false,
      textError: '',
      textSnack: '',
      sim: '',
      simID: '',
      headerProps: {
        sortByText: "Filtrar por",
      },
      headers: [
        { text: "ID", value: "dispositivoid" },
        { text: "Mascota", value: "mascota.nombre" },
        { text: "Edad", value: "mascota.edad" },
        { text: "Raza", value: "mascota.raza" },
        { text: "Tag", value: "descripcion" },
        { text: "Estado", value: "estado.descripcion" },
        { text: "Acciones", value: "actions" },
      ],
      data: {
        numero: ''
      },
      editemItem: {
        nombre: '',
        raza: '',
        edad: '',
        descripcion: '',
        usuarioid: '',
        simcardid: ''
      },
      defaultItem: {
        nombre: '',
        raza: '',
        edad: '',
        descripcion: '',
        usuarioid: '',
        simcardid: ''
      },
      dispositivos: []

    };
  },
  created() {
    this.getDispositivos();
  },
  methods: {
    getDispositivos() {
      User.dispositivosUsuario(localStorage.user)
        .then(response => {
          this.dispositivos = response.data
        }).catch(error => {
          console.log(error.response.data)
        })
    },

    comprobarSIM() {
      User.comprobarSIM(this.data)
        .then(response => {
          if (response.data.value == true) {
            this.alert = true
            this.textError = response.data.mensaje
          } else {
            this.alert = false
            this.editemItem.simcardid = response.data.sim
            this.editemItem.usuarioid = parseInt(localStorage.user)
            this.vincular()
          }
        })
        .catch(error => {
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

    validate() {
      var validacion = this.$refs.formPet.validate()
      if (validacion != false) {
        this.altaVinculacion();
      }
    },

    altaVinculacion() {
      User.crearVinculo(this.editemItem)
        .then(response => {
          console.log(response)
          this.getDispositivos()
          this.snackbar = true
          this.textSnack = response.data
          this.mostrarOK = true
          this.mostrarError = false
          this.mostrarCargando = false
          this.verData = true
          this.close()
        })
        .catch(e => {
          console.log(e.response.data)
        })
    },

    eliminarVinculacion(dispositivo_id) {
      console.log(dispositivo_id)
    },

    close() {
      this.$refs.formPet.reset();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.mostrarError = true
      this.mostrarCargando = false
    },

    finalizar() {
      this.dialog = false;
      this.altaVinculacion()
    },

    eliminar(item) {
      var r = confirm("Desea eliminar el registro")
      console.log(item)
      if (r) {
        this.eliminarVinculacion(item.dispositivoid)
      } else {
        this.textSnack = "Se cancelo la operacion"
        this.snackbar = true
      }
    }
  },
};
</script>
