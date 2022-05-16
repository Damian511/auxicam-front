import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: "#546E7A",
        accent: "#FF4081",
        secondary: "#ffe18d",
        success: "#4CAF50",
        info: "#2196F3",
        warning: "#FB8C00",
        error: "#FF5252",
      },
      light: {
        primary: "#546E7A",
        accent: "#e91e63",
        secondary: "#30b1dc",
        success: "#4CAF50",
        info: "#2196F3",
        warning: "#FB8C00",
        error: "#FF5252",
      },
    },
  },
  icons: {
    iconfont: "md",
  },
});