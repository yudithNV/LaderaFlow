<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import FondoIconos from './components/FondoIconos.vue'

const route = useRoute()
const year = new Date().getFullYear()

// El simulador se muestra a pantalla completa, sin navbar ni footer
const esSimulador = computed(() => route.name === 'simulador')
</script>

<template>
  <FondoIconos />

  <div class="app-layout">
    <Navbar v-if="!esSimulador" />

    <main :class="['page-shell', { 'page-shell--fullscreen': esSimulador }]">
      <RouterView />
    </main>

    <footer v-if="!esSimulador" class="site-footer">
      <div class="site-footer-inner">
        <strong class="footer-brand">LaderaFlow</strong>
        <p>© {{ year }} · Proyecto académico de rutas en La Paz</p>
        <RouterLink to="/aplicacion">Explorar rutas <span aria-hidden="true">→</span></RouterLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-shell.page-shell--fullscreen {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 clamp(16px, 4vw, 48px);
  box-sizing: border-box;
  min-height: 100vh;
}
</style>