<template>
  <div>
    <AppBar />
      <div class="body flex-grow-1 px-3">
        <v-container>
          <router-view></router-view>
        </v-container>
      </div>
      <AppFooter />
  </div>
</template>
<script>
import AppBar from '@/components/AppBar.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    AppBar,
  },
}
</script>
