<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  lineas: {
    type: Array,
    required: true,
  },
})

const heroBgRef = ref(null)
let rafId = null
let resizeHandler = null

const iconoTeleferico = `
  <path d="M10 3h.01"/>
  <path d="M14 2h.01"/>
  <path d="m2 9 20-5"/>
  <path d="M12 12V6.5"/>
  <rect width="12" height="10" x="6" y="12" rx="2.5"/>
  <path d="M10 12v5"/>
  <path d="M14 12v5"/>
  <path d="M6 17h12"/>
`

onMounted(() => {
  const contenedor = heroBgRef.value
  if (!contenedor || props.lineas.length === 0) return

  const NS = 'http://www.w3.org/2000/svg'
  const items = props.lineas.map((linea, index) => {
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '0.75')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')
    svg.classList.add('hero-cablecar-icon')
    svg.innerHTML = iconoTeleferico
    svg.style.color = linea.color
    contenedor.appendChild(svg)

    return { el: svg, index }
  })

  const margen = 980
  const velocidad = 75
  const escalonY = 48
  const baseAltura = -95
  const inicio = performance.now()
  const mod = (n, m) => ((n % m) + m) % m

  const posicionarCabinas = (ahora) => {
    const t = (ahora - inicio) / 1000
    const anchoBase = contenedor.clientWidth || window.innerWidth
    const anchoPista = Math.max(anchoBase + margen * 2, items.length * 660)
    const pendiente = escalonY / (anchoPista / items.length)

    for (const item of items) {
      const inicioX = (item.index / items.length) * anchoPista
      const x = mod(inicioX + t * velocidad, anchoPista) - margen
      const y = baseAltura + x * pendiente
      item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }

  const animar = (ahora) => {
    posicionarCabinas(ahora)
    rafId = requestAnimationFrame(animar)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    posicionarCabinas(inicio)
    resizeHandler = () => posicionarCabinas(inicio)
    window.addEventListener('resize', resizeHandler)
  } else {
    rafId = requestAnimationFrame(animar)
  }
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div class="hero-scene" aria-hidden="true">
    <div class="sky-backdrop"></div>
    <div class="horizon-glow"></div>

    <svg
      class="cityscape-svg"
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hero-mountain-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--mountain-top)" />
          <stop offset="100%" stop-color="var(--mountain-bottom)" />
        </linearGradient>
        <linearGradient id="hero-city-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--city-far)" />
          <stop offset="100%" stop-color="var(--city-near)" />
        </linearGradient>
      </defs>

      <path
        d="M0 360 L140 250 L260 300 L420 190 L550 265 L710 155 L860 245 L1030 130 L1180 220 L1310 175 L1440 260 L1440 520 L0 520 Z"
        fill="url(#hero-mountain-gradient)"
      />
      <path
        d="M710 155 L665 195 L695 190 L715 210 L740 188 L760 195 Z M1030 130 L975 182 L1010 176 L1035 198 L1065 174 L1090 182 Z"
        fill="var(--snow-color)"
      />

      <g fill="url(#hero-city-gradient)">
        <rect x="40" y="310" width="65" height="210" rx="3" />
        <rect x="120" y="275" width="80" height="245" rx="3" />
        <rect x="215" y="330" width="55" height="190" rx="3" />
        <rect x="340" y="290" width="75" height="230" rx="3" />
        <rect x="430" y="250" width="90" height="270" rx="3" />
        <rect x="535" y="315" width="60" height="205" rx="3" />
        <rect x="760" y="295" width="85" height="225" rx="3" />
        <rect x="860" y="260" width="70" height="260" rx="3" />
        <rect x="945" y="320" width="65" height="200" rx="3" />
        <rect x="1120" y="280" width="95" height="240" rx="3" />
        <rect x="1230" y="245" width="80" height="275" rx="3" />
        <rect x="1325" y="305" width="75" height="215" rx="3" />
      </g>

      <g stroke="var(--tower-color)" stroke-width="2.5" fill="none" opacity="0.65">
        <path d="M275 520 L292 225 L308 520 M282 360 L301 360 M286 290 L297 290 M270 225 L314 225" />
        <path d="M1070 520 L1087 245 L1104 520 M1077 375 L1096 375 M1081 310 L1092 310 M1065 245 L1109 245" />
      </g>

      <path
        d="M0 430 L0 390 L55 390 L55 365 L115 365 L115 405 L175 405 L175 350 L245 350 L245 395 L320 395 L320 375 L395 375 L395 410 L470 410 L470 340 L555 340 L555 385 L640 385 L640 415 L725 415 L725 360 L810 360 L810 395 L895 395 L895 345 L975 345 L975 390 L1050 390 L1050 415 L1145 415 L1145 355 L1225 355 L1225 385 L1305 385 L1305 365 L1385 365 L1385 400 L1440 400 L1440 520 L0 520 Z"
        fill="var(--city-near)"
      />

      <g fill="var(--window-light)">
        <rect x="140" y="295" width="6" height="8" rx="1" />
        <rect x="155" y="295" width="6" height="8" rx="1" />
        <rect x="140" y="315" width="6" height="8" rx="1" />
        <rect x="450" y="275" width="7" height="9" rx="1" />
        <rect x="468" y="275" width="7" height="9" rx="1" />
        <rect x="486" y="295" width="7" height="9" rx="1" />
        <rect x="450" y="315" width="7" height="9" rx="1" />
        <rect x="880" y="285" width="6" height="8" rx="1" />
        <rect x="896" y="305" width="6" height="8" rx="1" />
        <rect x="1250" y="270" width="7" height="9" rx="1" />
        <rect x="1268" y="270" width="7" height="9" rx="1" />
        <rect x="1250" y="292" width="7" height="9" rx="1" />
        <rect x="1165" y="375" width="6" height="8" rx="1" />
        <rect x="495" y="365" width="6" height="8" rx="1" />
        <rect x="512" y="365" width="6" height="8" rx="1" />
        <rect x="195" y="372" width="6" height="8" rx="1" />
      </g>
    </svg>

    <div ref="heroBgRef" class="hero-cablecars-layer"></div>
    <div class="hero-vignette"></div>
  </div>
</template>

<style scoped>
.hero-scene {
  --sky-top: #050814;
  --sky-mid: #0d1630;
  --sky-horizon: #1e294b;
  --glow-horizon: rgba(56, 189, 248, 0.22);
  --mountain-top: #182342;
  --mountain-bottom: #0d1326;
  --snow-color: rgba(226, 232, 240, 0.14);
  --city-far: #0c1224;
  --city-near: #070b16;
  --tower-color: #334155;
  --window-light: rgba(250, 204, 21, 0.45);

  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

:root[data-theme="light"] .hero-scene {
  --sky-top: #bae6fd;
  --sky-mid: #e0f2fe;
  --sky-horizon: #fef3c7;
  --glow-horizon: rgba(251, 191, 36, 0.35);
  --mountain-top: #94a3b8;
  --mountain-bottom: #cbd5e1;
  --snow-color: rgba(255, 255, 255, 0.75);
  --city-far: #94a3b8;
  --city-near: #64748b;
  --tower-color: #475569;
  --window-light: rgba(255, 255, 255, 0.55);
}

.sky-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 55%, var(--sky-horizon) 100%);
  transition: background 400ms ease;
}

.horizon-glow {
  position: absolute;
  left: 50%;
  bottom: 12%;
  width: 90vw;
  height: 45vh;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, var(--glow-horizon) 0%, transparent 70%);
}

.cityscape-svg {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 62%;
  min-height: 320px;
}

.hero-cablecars-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

:deep(.hero-cablecar-icon) {
  position: absolute;
  left: 0;
  top: 0;
  width: clamp(620px, 74vw, 960px);
  height: clamp(620px, 74vw, 960px);
  opacity: 0.48;
  will-change: transform;
}

:root[data-theme="light"] :deep(.hero-cablecar-icon) {
  opacity: 0.45;
  filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.25));
}

.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 45%, transparent 35%, rgba(4, 7, 15, 0.45) 100%);
}

:root[data-theme="light"] .hero-vignette {
  background: radial-gradient(circle at 50% 45%, transparent 45%, rgba(241, 245, 249, 0.35) 100%);
}
</style>
