<script setup>
import Navbar from './components/Navbar.vue'
import FondoIconos from './components/FondoIconos.vue'
</script>

<template>
  <FondoIconos />
  <Navbar />
  <main class="page-shell">
    <RouterView />
  </main>
</template>