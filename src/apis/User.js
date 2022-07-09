import Api from "./Api";
import Csrf from "./Csrf";

export default {
  async register(form) {
    await Csrf.getCookie();

    return Api.post("/register", form);
  },

  async login(form) {
    await Csrf.getCookie();

    return Api.post("/login", form);
  },

  async logout() {
    await Csrf.getCookie();

    return Api.post("/logout");
  },

  auth() {
    return Api.get("/user");
  },

  //metodos para la vista de vincular
  comprobarSIM(numero){
    return Api.put("/comprobarSIM",numero);
  },

  crearVinculo(data){
    return Api.post("/altaDispositivo",data);
  },

  dispositivosUsuario(data){
    return Api.get("/dispositivosUsuarios?usuarioid="+data);
  },
  
  //metodos para el inicio
  obtenerLocalizaciones(data){
    return Api.get("/localizaciones?dispositivoid="+data);
  },

  //metodos para el historico
  obtenerHistorico(data){
    return Api.put("/historico",data);
  },

  //metodo para cambiar contraseña
  cambiarPass(form,id){
    return Api.put("/cambiarPass/"+id,form);
  },

};