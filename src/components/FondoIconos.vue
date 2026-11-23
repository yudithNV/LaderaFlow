<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const fondoRef = ref(null)
let rafId = null

const iconos = [
  `<path d="M10 3h.01"/><path d="M14 2h.01"/><path d="m2 9 20-5"/><path d="M12 12V6.5"/><rect width="16" height="10" x="4" y="12" rx="3"/><path d="M9 12v5"/><path d="M15 12v5"/><path d="M4 17h16"/>`,
  `<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>`,
]

const colores = ['#9b72e8', '#ec4899', '#22c55e']

const cantidad = 35
const columnas = 7
const filas = 5
const velocidadX = 30
const velocidadY = 18
const margen = 40

onMounted(() => {
  const fondo = fondoRef.value
  if (!fondo) return

  fondo.innerHTML = ''
  const NS = 'http://www.w3.org/2000/svg'
  const items = []

  for (let i = 0; i < cantidad; i++) {
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '2')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')
    svg.classList.add('bg-icon')
    svg.innerHTML = iconos[i % iconos.length]
    svg.style.color = colores[i % colores.length]

    const col = i % columnas
    const fila = Math.floor(i / columnas) % filas
    items.push({
      el: svg,
      col,
      fila,
      desfase: (i % 3) * 20,
    })

    fondo.appendChild(svg)
  }

  const mod = (n, m) => ((n % m) + m) % m
  const inicio = performance.now()

  const animar = (ahora) => {
    const t = (ahora - inicio) / 1000
    const anchoTotal = window.innerWidth + margen * 2
    const altoTotal = window.innerHeight + margen * 2

    for (const item of items) {
      const baseX = item.col * (window.innerWidth / columnas) + item.desfase
      const baseY = item.fila * (window.innerHeight / filas)

      const x = mod(baseX + t * velocidadX, anchoTotal) - margen
      const y = mod(baseY + t * velocidadY, altoTotal) - margen

      item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    rafId = requestAnimationFrame(animar)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducedMotion) {
    rafId = requestAnimationFrame(animar)
  } else {
    animar(inicio)
  }
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="fondoRef" class="bg-icons-layer" aria-hidden="true"></div>
</template>

<style scoped>
.bg-icons-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

:deep(.bg-icon) {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  opacity: 0.14;
  will-change: transform;
}

:root[data-theme="light"] :deep(.bg-icon) {
  opacity: 0.12;
}
</style>