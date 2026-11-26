<script setup>
const transportModes = [
  {
    code: 'TLF',
    title: 'Red Mi Teleférico',
    detail: '26 estaciones distribuidas en 10 líneas. El tiempo de fila se penaliza únicamente al abordar una línea, no en tránsito continuo.',
  },
  {
    code: 'MNB',
    title: 'Tramos en Minibús',
    detail: 'Conexiones urbanas hacia UCB, Centro, Miraflores, Calacoto, Ceja y Terminal. Sensibles a hora pico y bloqueos.',
  },
  {
    code: 'CAM',
    title: 'Transbordos a Pie',
    detail: 'Caminatas cortas de enlace entre estaciones y paradas clave medidas en minutos reales.',
  },
]
</script>

<template>
  <section class="view intro-layout">

    <!-- HERO EDITORIAL SIN CARD -->
    <div class="hero">
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

      <!-- Diagrama SVG sin caja -->
      <div class="hero-diagram" aria-hidden="true">
        <svg viewBox="0 0 380 290" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mountainFill" x1="190" y1="70" x2="190" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#9b72e8" stop-opacity="0.14" />
              <stop offset="100%" stop-color="#9b72e8" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="cableStroke" x1="48" y1="68" x2="332" y2="176" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#ec4899" />
              <stop offset="55%" stop-color="#9b72e8" />
              <stop offset="100%" stop-color="#22c55e" />
            </linearGradient>
          </defs>

          <g stroke="currentColor" stroke-opacity="0.06" stroke-width="1">
            <line x1="20" y1="60" x2="360" y2="60" />
            <line x1="20" y1="120" x2="360" y2="120" />
            <line x1="20" y1="180" x2="360" y2="180" />
            <line x1="20" y1="240" x2="360" y2="240" />
            <line x1="90" y1="25" x2="90" y2="265" />
            <line x1="190" y1="25" x2="190" y2="265" />
            <line x1="290" y1="25" x2="290" y2="265" />
          </g>

          <path d="M24 98 L98 104 L168 188 L244 206 L356 218 L356 265 L24 265 Z" fill="url(#mountainFill)" />
          <path d="M24 98 L98 104 L168 188 L244 206 L356 218" stroke="#9b72e8" stroke-opacity="0.3" stroke-width="1.5" />

          <path d="M54 96 C92 145, 118 195, 174 196 C225 197, 255 224, 326 216" stroke="#ec4899" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="5 5" />

          <path d="M54 74 L184 128 L326 184" stroke="url(#cableStroke)" stroke-width="3" stroke-linecap="round" />

          <line x1="54" y1="74" x2="54" y2="98" stroke="#ec4899" stroke-width="2" />
          <line x1="184" y1="128" x2="184" y2="192" stroke="#9b72e8" stroke-width="2" />
          <line x1="326" y1="184" x2="326" y2="216" stroke="#22c55e" stroke-width="2" />

          <g class="cabin-float">
            <rect x="111" y="92" width="16" height="11" rx="3" fill="#1a1825" stroke="#f472b6" stroke-width="1.8" />
            <line x1="119" y1="86" x2="119" y2="92" stroke="#f472b6" stroke-width="1.5" />
          </g>

          <circle cx="54" cy="74" r="6" fill="#ec4899" />
          <circle cx="54" cy="74" r="11" stroke="#ec4899" stroke-opacity="0.3" stroke-width="1.5" />
          <circle cx="184" cy="128" r="5.5" fill="#9b72e8" />
          <circle cx="326" cy="184" r="6" fill="#22c55e" />
          <circle cx="326" cy="184" r="11" stroke="#22c55e" stroke-opacity="0.3" stroke-width="1.5" />

          <g font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700">
            <rect x="34" y="42" width="76" height="20" rx="5" fill="#ec4899" fill-opacity="0.12" />
            <text x="42" y="55" fill="#f472b6">CEJA · 4090m</text>
            <rect x="150" y="102" width="68" height="20" rx="5" fill="#9b72e8" fill-opacity="0.14" />
            <text x="161" y="115" fill="#c4b5fd">CENTRO</text>
            <rect x="272" y="152" width="84" height="20" rx="5" fill="#22c55e" fill-opacity="0.12" />
            <text x="280" y="165" fill="#4ade80">UCB OBRAJES</text>
            <text x="138" y="246" fill="#ec4899" fill-opacity="0.75">Minibús: +tráfico / paro</text>
          </g>
        </svg>
      </div>
    </div>

    <!-- MODOS: columnas con separadores, sin cards -->
    <div class="modes-row">
      <article v-for="(mode, i) in transportModes" :key="mode.code" class="mode-col" :class="{ 'mode-col--first': i === 0 }">
        <div class="mode-header">
          <span class="mode-code">{{ mode.code }}</span>
          <h2>{{ mode.title }}</h2>
        </div>
        <p>{{ mode.detail }}</p>
      </article>
    </div>

    <!-- BLOQUE INFERIOR: texto + media sin marcos -->
    <div class="showcase-row">
      <div class="context-block">
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

      <figure class="media-block">
        <div class="media-canvas">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
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
/* ============================================================
   RESET DEL CONTENEDOR DE LA VISTA
   Anula el "card" que mete el CSS global (section.view / .view)
   ============================================================ */
.intro-layout,
section.view.intro-layout {
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 6vw, 72px);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
}

/* ============ HERO SIN CARD (reset agresivo) ============ */
.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: clamp(28px, 4vw, 56px);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
}

/* Cualquier wrapper interno tampoco debe pintar caja */
.hero > *,
.hero-copy,
.hero-diagram {
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.kicker-line {
  width: 26px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-pink), var(--accent-green));
}

.kicker-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-solid);
}

.hero-copy h1 {
  font-size: clamp(2.3rem, 4.6vw, 3.6rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  margin: 0 0 20px;
  font-weight: 800;
}

.title-highlight {
  background: linear-gradient(95deg, var(--accent-solid), var(--accent-pink) 55%, var(--accent-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lead {
  font-size: clamp(0.98rem, 1.15vw, 1.08rem);
  line-height: 1.65;
  max-width: 54ch;
  margin-bottom: 0;
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
}

.action-main {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 22px;
  border-radius: 8px;
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
  padding: 12px 4px;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  background: transparent;
  transition: border-color 160ms ease, color 160ms ease;
}

.action-sec:hover {
  border-color: var(--accent-solid);
  color: var(--accent-solid);
}

.meta-strip {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.meta-strip b {
  color: var(--text-primary);
}

.meta-strip .sep {
  opacity: 0.35;
}

/* Diagrama flotante sin caja */
.hero-diagram svg {
  width: 100%;
  height: auto;
  display: block;
}

.cabin-float {
  animation: cabinMove 4s ease-in-out infinite alternate;
}

@keyframes cabinMove {
  from { transform: translate(-18px, -7px); }
  to { transform: translate(34px, 14px); }
}

/* ============ MODOS COMO COLUMNAS EDITORIALES ============ */
.modes-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--border-color);
}

.mode-col {
  padding: 28px 28px 28px 0;
  border-right: 1px solid var(--border-color);
}

.mode-col:last-child {
  border-right: none;
  padding-right: 0;
}

.mode-col--first {
  padding-left: 0;
}

.mode-col:not(.mode-col--first) {
  padding-left: 28px;
}

.mode-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.mode-header h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.mode-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-solid);
  opacity: 0.85;
}

.mode-col p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ SHOWCASE INFERIOR SIN MARCOS ============ */
.showcase-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
  padding-top: clamp(32px, 4vw, 48px);
  border-top: 1px solid var(--border-color);
}

.eyebrow {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-solid);
  display: block;
  margin-bottom: 14px;
}

.context-block h2 {
  font-size: clamp(1.4rem, 2.2vw, 1.85rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  margin: 0 0 16px;
}

.context-block p {
  font-size: 0.94rem;
  line-height: 1.68;
  color: var(--text-secondary);
  margin: 0;
}

.context-block code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.84em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--accent-soft-bg);
  color: var(--accent-green);
}

.media-block {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.media-canvas {
  min-height: 200px;
  border-radius: 10px;
  background: var(--bg-surface-2);
  border: 1px dashed var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 600;
}

.media-block figcaption {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-diagram {
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }

  .modes-row {
    grid-template-columns: 1fr;
  }

  .mode-col,
  .mode-col:not(.mode-col--first),
  .mode-col--first {
    padding: 24px 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .mode-col:last-child {
    border-bottom: none;
  }

  .showcase-row {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>