<template>
  <v-container>
    <h1>Not Found!</h1>
    <img src="@/assets/error_404.jpg" alt="ERROR_404">
    <p>
      <router-link to="/" class="text-decoration-none">Ir al inicio</router-link>
    </p>
  </v-container>
</template>

<script>

  export default {
    name: 'NotFound'
  }

</script>

<style scoped>

  center {
    margin: 15vw;
  }

  h1 {
    color: var(--border);
    font-size: 2em;
  }

  img {
    width: 30%;
  }

</style>