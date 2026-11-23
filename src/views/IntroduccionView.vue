<script setup>
const transportModes = [
  {
    code: 'TLF',
    title: 'Red Mi Teleférico',
    detail: '26 estaciones distribuidas en 10 líneas. El tiempo de fila se penaliza únicamente al abordar una línea, no en tránsito continuo.',
    accent: '#9b72e8',
  },
  {
    code: 'MNB',
    title: 'Tramos en Minibús',
    detail: 'Conexiones urbanas hacia UCB, Centro, Miraflores, Calacoto, Ceja y Terminal. Sensibles a hora pico y bloqueos.',
    accent: '#ec4899',
  },
  {
    code: 'CAM',
    title: 'Transbordos a Pie',
    detail: 'Caminatas cortas de enlace entre estaciones y paradas clave medidas en minutos reales.',
    accent: '#22c55e',
  },
]
</script>

<template>
  <section class="view intro-layout">
    <!-- Hero asimétrico con ilustración esquemática de La Paz -->
    <div class="card hero-editorial">
      <div class="hero-copy">
        <div class="kicker-row">
          <span class="kicker-line"></span>
          <span class="kicker-text">GRAFOS · DIJKSTRA · LA PAZ</span>
        </div>

        <h1>
          La ruta más corta<br />
          <span class="title-highlight">no siempre llega primero.</span>
        </h1>

        <p class="lead">
          <strong>LaderaFlow</strong> modela la movilidad de La Paz como un grafo ponderado en
          minutos. Evalúa teleférico, minibús y caminata bajo tres condiciones reales:
          <em>flujo normal, hora pico y paro con bloqueos</em>.
        </p>

        <div class="hero-cta-group">
          <RouterLink class="action-main" to="/aplicacion">
            <span>Explorar mapa interactivo</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>

          <RouterLink class="action-sec" to="/marco-teorico">
            Cómo funciona Dijkstra
          </RouterLink>
        </div>

        <div class="meta-strip">
          <span><b>32</b> nodos activos</span>
          <span class="sep">/</span>
          <span><b>10</b> líneas de cable</span>
          <span class="sep">/</span>
          <span><b>redLaPaz.json</b></span>
        </div>
      </div>

      <!-- Ilustración SVG custom: perfil topográfico + cable + ruta terrestre -->
      <div class="hero-diagram" aria-hidden="true">
        <svg viewBox="0 0 380 290" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mountainFill" x1="190" y1="70" x2="190" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#9b72e8" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#9b72e8" stop-opacity="0.01" />
            </linearGradient>
            <linearGradient id="cableStroke" x1="48" y1="68" x2="332" y2="176" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#ec4899" />
              <stop offset="55%" stop-color="#9b72e8" />
              <stop offset="100%" stop-color="#22c55e" />
            </linearGradient>
          </defs>

          <!-- Cuadrícula técnica sutil -->
          <g stroke="currentColor" stroke-opacity="0.07" stroke-width="1">
            <line x1="20" y1="60" x2="360" y2="60" />
            <line x1="20" y1="120" x2="360" y2="120" />
            <line x1="20" y1="180" x2="360" y2="180" />
            <line x1="20" y1="240" x2="360" y2="240" />
            <line x1="90" y1="25" x2="90" y2="265" />
            <line x1="190" y1="25" x2="190" y2="265" />
            <line x1="290" y1="25" x2="290" y2="265" />
          </g>

          <!-- Relieve de la hoyada paceña (El Alto -> Centro -> Zona Sur) -->
          <path
            d="M24 98 L98 104 L168 188 L244 206 L356 218 L356 265 L24 265 Z"
            fill="url(#mountainFill)"
          />
          <path
            d="M24 98 L98 104 L168 188 L244 206 L356 218"
            stroke="#9b72e8"
            stroke-opacity="0.35"
            stroke-width="1.5"
          />

          <!-- Ruta terrestre (minibús con rodeo / congestión) -->
          <path
            d="M54 96 C92 145, 118 195, 174 196 C225 197, 255 224, 326 216"
            stroke="#ec4899"
            stroke-opacity="0.55"
            stroke-width="2"
            stroke-dasharray="5 5"
          />

          <!-- Línea aérea del teleférico (ruta directa óptima) -->
          <path
            d="M54 74 L184 128 L326 184"
            stroke="url(#cableStroke)"
            stroke-width="3"
            stroke-linecap="round"
          />

          <!-- Torres / pilonas -->
          <line x1="54" y1="74" x2="54" y2="98" stroke="#ec4899" stroke-width="2" />
          <line x1="184" y1="128" x2="184" y2="192" stroke="#9b72e8" stroke-width="2" />
          <line x1="326" y1="184" x2="326" y2="216" stroke="#22c55e" stroke-width="2" />

          <!-- Cabina animada sobre el cable -->
          <g class="cabin-float">
            <rect x="111" y="92" width="16" height="11" rx="3" fill="#1a1825" stroke="#f472b6" stroke-width="1.8" />
            <line x1="119" y1="86" x2="119" y2="92" stroke="#f472b6" stroke-width="1.5" />
          </g>

          <!-- Nodos principales -->
          <circle cx="54" cy="74" r="6" fill="#ec4899" />
          <circle cx="54" cy="74" r="11" stroke="#ec4899" stroke-opacity="0.35" stroke-width="1.5" />

          <circle cx="184" cy="128" r="5.5" fill="#9b72e8" />
          <circle cx="326" cy="184" r="6" fill="#22c55e" />
          <circle cx="326" cy="184" r="11" stroke="#22c55e" stroke-opacity="0.35" stroke-width="1.5" />

          <!-- Etiquetas técnicas -->
          <g font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700">
            <rect x="34" y="42" width="76" height="20" rx="5" fill="#ec4899" fill-opacity="0.16" />
            <text x="42" y="55" fill="#f472b6">CEJA · 4090m</text>

            <rect x="150" y="102" width="68" height="20" rx="5" fill="#9b72e8" fill-opacity="0.18" />
            <text x="161" y="115" fill="#c4b5fd">CENTRO</text>

            <rect x="272" y="152" width="84" height="20" rx="5" fill="#22c55e" fill-opacity="0.16" />
            <text x="280" y="165" fill="#4ade80">UCB OBRAJES</text>

            <text x="138" y="246" fill="#ec4899" fill-opacity="0.85">Minibús: +tráfico / paro</text>
          </g>
        </svg>
      </div>
    </div>

    <!-- Arquitectura del modelo en 3 bloques técnicos -->
    <div class="modes-grid">
      <article v-for="mode in transportModes" :key="mode.code" class="card mode-card">
        <div class="mode-header">
          <span class="mode-code" :style="{ color: mode.accent, borderColor: mode.accent }">
            {{ mode.code }}
          </span>
          <h2>{{ mode.title }}</h2>
        </div>
        <p>{{ mode.detail }}</p>
      </article>
    </div>

    <!-- Sección media limpia (sin cajas punteadas genéricas) -->
    <div class="showcase-grid">
      <div class="card context-card">
        <span class="eyebrow">Motivación del modelo</span>
        <h2>¿Por qué medir tiempo y no distancia?</h2>
        <p>
          En una ciudad con pendientes pronunciadas y cuellos de botella viales, dos puntos
          cercanos en el mapa pueden tomar el doble de tiempo según la hora del día. Al
          separar la topología de la red en <code>redLaPaz.json</code>, el sistema recalcula
          en milisegundos cómo cambian las decisiones cuando sube la demanda o se corta el
          transporte vehicular.
        </p>
      </div>

      <figure class="card media-frame">
        <div class="media-canvas">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M21 15l-5-4.5L7 20" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Vista del mapa / captura de La Paz</span>
        </div>
        <figcaption>Espacio listo para insertar imagen o video demostrativo del recorrido.</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hero-editorial {
  display: grid;
  grid-template-columns: 1.2fr 0.95fr;
  align-items: center;
  gap: 32px;
  padding: clamp(26px, 4.5vw, 44px);
}

.kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.kicker-line {
  width: 26px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-pink), var(--accent-green));
}

.kicker-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-solid);
}

.hero-copy h1 {
  font-size: clamp(2.1rem, 4.4vw, 3.35rem);
  line-height: 1.06;
  letter-spacing: -0.03em;
  margin-bottom: 18px;
}

.title-highlight {
  background: linear-gradient(95deg, var(--accent-solid), var(--accent-pink) 55%, var(--accent-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.action-main {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  color: #ffffff;
  background: var(--accent-solid);
  transition: transform 160ms ease, filter 160ms ease;
}

.action-main:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
}

.action-sec {
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  background: transparent;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.action-sec:hover {
  border-color: var(--accent-solid);
  background: var(--accent-soft-bg);
}

.meta-strip {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.meta-strip b {
  color: var(--text-primary);
}

.meta-strip .sep {
  opacity: 0.35;
}

/* Diagrama SVG */
.hero-diagram {
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-body);
  padding: 12px;
  color: var(--text-primary);
}

.hero-diagram svg {
  width: 100%;
  height: auto;
  display: block;
}

.cabin-float {
  animation: cabinMove 4s ease-in-out infinite alternate;
}

@keyframes cabinMove {
  from {
    transform: translate(-18px, -7px);
  }
  to {
    transform: translate(34px, 14px);
  }
}

/* 3 modos de transporte */
.modes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.mode-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.mode-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.mode-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid;
  letter-spacing: 0.06em;
}

/* Bloque inferior */
.showcase-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.95fr;
  gap: 20px;
}

.context-card code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--accent-soft-bg);
  color: var(--accent-green);
}

.media-frame {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
}

.media-canvas {
  min-height: 170px;
  border-radius: 12px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 0.86rem;
  font-weight: 600;
}

.media-frame figcaption {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

@media (max-width: 920px) {
  .hero-editorial,
  .showcase-grid {
    grid-template-columns: 1fr;
  }

  .modes-grid {
    grid-template-columns: 1fr;
  }
}
</style>