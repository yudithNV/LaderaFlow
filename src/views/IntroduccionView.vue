<script setup>
import capturaSistema from '../assets/captura-sistema.png' // ajusta la ruta según dónde esté tu componente
import redLaPaz from '../data/redLaPaz.json'
import HeroTeleferico from '../components/HeroTeleferico.vue'

const lineasTeleferico = redLaPaz.lineas

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

const stats = [
  { value: '4,000', unit: 'm', label: 'Desnivel topográfico' },
  { value: '10', unit: 'Líneas', label: 'Red de Teleférico' },
  { value: '3x', unit: 'Var.', label: 'Cambio en hora pico' },
  { value: '32', unit: 'Nodos', label: 'Modelados en el grafo' },
]
</script>

<template>
  <section class="view intro-layout">

    <!-- 1. HERO EDITORIAL -->
    <div class="hero">
      <HeroTeleferico :lineas="lineasTeleferico" />

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          GRAFOS · DIJKSTRA · LA PAZ
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>

          <RouterLink class="action-sec" to="/marco-teorico">
            Cómo funciona Dijkstra
          </RouterLink>
        </div>
      </div>

      <ul class="hero-lines" aria-label="Líneas de teleférico modeladas">
        <li v-for="linea in lineasTeleferico" :key="linea.id" class="hero-line-chip">
          <span class="hero-line-dot" :style="{ backgroundColor: linea.color }"></span>
          {{ linea.nombre }}
        </li>
      </ul>
    </div>

    <!-- 2. NUEVO: PANEL DE ESTADÍSTICAS IMPONENTE -->
    <div class="stats-panel">
      <div v-for="(stat, i) in stats" :key="i" class="stat-item">
        <div class="stat-value">{{ stat.value }}<span class="stat-unit">{{ stat.unit }}</span></div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <!-- 3. NUEVO: EL DESAFÍO PACCEÑO (Texto denso para el inge) -->
    <div class="challenge-row">
      <div class="challenge-title">
        <span class="eyebrow">El Desafío Paceño</span>
        <h2>La topología como variable de peso.</h2>
      </div>
      <div class="challenge-text">
        <p>
          Moverse en La Paz no es un problema de distancia euclidiana. Es un problema de <strong>optimización de recursos en un entorno hostil</strong>. Un trayecto entre la Ceja y Obrajes puede demorar 25 minutos a las 10:00 a.m., pero hasta 75 minutos a las 18:30 p.m. por saturación vehicular y filas en las estaciones.
        </p>
        <p>
          Los mapas tradicionales fallan porque asumen pesos estáticos. Este proyecto introduce un <strong>grafo dirigido con pesos dinámicos</strong>, donde las aristas representan minutos reales de viaje. Al aplicar el algoritmo de Dijkstra sobre esta red, el sistema no solo encuentra la ruta más corta, sino que <strong>reconfigura la topología completa</strong> si el usuario simula un bloqueo o un paro de transportistas.
        </p>
      </div>
    </div>

    <!-- 4. MODOS DE TRANSPORTE -->
    <div class="modes-row">
      <article v-for="(mode, i) in transportModes" :key="mode.code" class="mode-col" :class="{ 'mode-col--first': i === 0 }">
        <div class="mode-header">
          <span class="mode-code">{{ mode.code }}</span>
          <h2>{{ mode.title }}</h2>
        </div>
        <p>{{ mode.detail }}</p>
      </article>
    </div>

    <!-- 5. NUEVO: GALERÍA / PREVIEWS (Las imágenes que pediste) -->
    <div class="preview-section">
      <div class="preview-header">
        <span class="eyebrow">Vistas del Sistema</span>
        <h2>De los datos a la decisión.</h2>
      </div>
      
      <div class="preview-grid">
        <div class="preview-card">
          <div class="preview-image mockup-1">
            <!-- SVG simulado de un mapa -->
            <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="20" cy="30" r="3" fill="var(--accent-pink)"/>
              <circle cx="80" cy="20" r="3" fill="var(--accent-green)"/>
              <path d="M20 30 Q 50 10 80 20" stroke-dasharray="3 3"/>
            </svg>
            <span class="preview-tag">Interfaz</span>
          </div>
          <h3>Mapa Interactivo</h3>
          <p>Selección de origen y destino con renderizado en tiempo real de las 32 estaciones.</p>
        </div>

        <div class="preview-card">
          <div class="preview-image mockup-2">
            <!-- SVG simulado de código/grafo -->
            <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="30" y="15" width="40" height="30" rx="4" />
              <path d="M40 30 L 60 30 M 50 20 L 50 40" />
            </svg>
            <span class="preview-tag">Algoritmo</span>
          </div>
          <h3>Motor Dijkstra</h3>
          <p>Cálculo de la ruta óptima con matrices de adyacencia y colas de prioridad.</p>
        </div>

        <div class="preview-card">
          <div class="preview-image mockup-3">
            <!-- SVG simulado de gráficos -->
            <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="20" y="40" width="10" height="10" />
              <rect x="45" y="25" width="10" height="25" />
              <rect x="70" y="15" width="10" height="35" />
            </svg>
            <span class="preview-tag">Métricas</span>
          </div>
          <h3>Comparativa de Escenarios</h3>
          <p>Visualización de la diferencia de minutos entre hora pico, flujo normal y paros.</p>
        </div>
      </div>
    </div>

    <!-- 6. SHOWCASE INFERIOR (Por qué tiempo y no distancia) -->
    <div class="showcase-row">
      <div class="context-block">
        <span class="eyebrow">Motivación del modelo</span>
        <h2>¿Por qué medir tiempo y no distancia?</h2>
        <p>
          En una ciudad con pendientes pronunciadas y cuellos de botella viales, dos puntos
          cercanos en el mapa pueden tomar el doble de tiempo según la hora del día. Al
          separar la estructura de la red de transporte de los tiempos de cada conexión,
          el sistema recalcula en milisegundos cómo cambian las decisiones cuando sube la
          demanda o se corta el transporte vehicular.
        </p>
      </div>

      <figure class="media-block">
        <img
          :src="capturaSistema"
          alt="Captura de pantalla del sistema LaderaFlow en funcionamiento"
          class="media-img"
        />
        <figcaption>El sistema está diseñado para adaptarse a futuras expansiones de la red de teleférico.</figcaption>
      </figure>
    </div>

  </section>
</template>

<style scoped>
/* ============================================================
   RESET DEL CONTENEDOR
   ============================================================ */
.intro-layout,
section.view.intro-layout {
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 6vw, 80px);
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
}

.intro-layout > :not(.hero) {
  width: min(1120px, calc(100% - 40px));
  align-self: center;
}

/* ============ HERO ============ */
.hero {
  --hero-text: #f8fafc;
  --hero-subtext: #e2e8f0;
  --hero-border: rgba(255, 255, 255, 0.16);
  --hero-pill: rgba(9, 13, 26, 0.65);

  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(22px, 4vh, 36px);
  width: 100%;
  min-height: calc(100vh - 72px);
  min-height: max(620px, calc(100svh - 72px));
  margin: 0;
  padding: clamp(76px, 11vh, 112px) 24px clamp(42px, 7vh, 72px);
  overflow: hidden;
  border: none;
  background: transparent;
}

:root[data-theme="light"] .hero {
  --hero-text: #0f172a;
  --hero-subtext: #1e293b;
  --hero-border: rgba(15, 23, 42, 0.16);
  --hero-pill: rgba(255, 255, 255, 0.78);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 860px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  padding: 7px 14px;
  border: 1px solid var(--hero-border);
  border-radius: 999px;
  background: var(--hero-pill);
  color: var(--hero-subtext);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 10px #22c55e;
}

.hero-content h1 {
  color: var(--hero-text);
  font-size: clamp(2.6rem, 5.5vw, 4.4rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  margin: 0 0 22px;
  font-weight: 800;
  text-shadow: 0 4px 28px rgba(0, 0, 0, 0.6);
}

:root[data-theme="light"] .hero-content h1 {
  text-shadow: 0 4px 24px rgba(255, 255, 255, 0.95);
}

.title-highlight {
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:root[data-theme="light"] .title-highlight {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-content .lead {
  max-width: 62ch;
  margin: 0;
  color: var(--hero-subtext);
  font-size: clamp(1.05rem, 1.8vw, 1.2rem);
  line-height: 1.65;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.65);
}

:root[data-theme="light"] .hero-content .lead {
  text-shadow: 0 2px 16px rgba(255, 255, 255, 0.95);
}

.hero-cta-group {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 30px;
  margin-bottom: 0;
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
  color: var(--hero-text);
  border-bottom: 1px solid var(--hero-border);
  transition: border-color 160ms ease, color 160ms ease;
}

.action-sec:hover {
  border-color: var(--accent-solid);
  color: var(--accent-solid);
}

.hero-lines {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 920px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid var(--hero-border);
  border-radius: 16px;
  background: var(--hero-pill);
  list-style: none;
  backdrop-filter: blur(12px);
}

.hero-line-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.1);
  color: var(--hero-subtext);
  font-size: 0.78rem;
  font-weight: 600;
}

.hero-line-dot {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border: 1px solid rgba(15, 23, 42, 0.25);
  border-radius: 50%;
}

/* ============ NUEVO: PANEL DE ESTADÍSTICAS ============ */
.stats-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 24px 0;
}

.stat-item {
  padding: 0 24px;
  border-right: 1px solid var(--border-color);
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-family: "JetBrains Mono", monospace;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-unit {
  font-size: 0.9rem;
  color: var(--accent-solid);
  margin-left: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* ============ NUEVO: EL DESAFÍO PACEÑO ============ */
.challenge-row {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
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

.challenge-title h2 {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.challenge-text p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-top: 0;
  margin-bottom: 16px;
}

.challenge-text p:last-child {
  margin-bottom: 0;
}

.challenge-text strong {
  color: var(--text-primary);
}

/* ============ MODOS ============ */
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
}

.mode-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--accent-solid);
}

.mode-col p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ NUEVO: PREVIEWS / GALERÍA ============ */
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.preview-header h2 {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.preview-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-image {
  height: 160px;
  border-radius: 8px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.preview-card:hover .preview-image {
  transform: translateY(-4px);
  border-color: var(--accent-solid);
}

.preview-image svg {
  width: 60%;
  height: 60%;
  color: var(--text-secondary);
  opacity: 0.5;
}

.preview-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 4px 8px;
  background: var(--accent-soft-bg);
  color: var(--accent-solid);
  border-radius: 4px;
}

.preview-card h3 {
  font-size: 1.05rem;
  margin: 0;
  font-weight: 700;
}

.preview-card p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
}
/* ============ NUEVO: SHOWCASE INFERIOR ============ */
.media-img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  display: block;
}

/* ============ SHOWCASE INFERIOR ============ */
.showcase-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
  padding-top: clamp(32px, 4vw, 48px);
  border-top: 1px solid var(--border-color);
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
    gap: 28px;
    padding-inline: 20px;
  }
  .hero-content {
    max-width: 780px;
  }
  .hero-lines {
    max-width: 760px;
  }
  .stats-panel {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 0;
  }
  .stat-item {
    border-right: none;
  }
  .stat-item:nth-child(odd) {
    border-right: 1px solid var(--border-color);
  }
  .challenge-row {
    grid-template-columns: 1fr;
  }
  .modes-row {
    grid-template-columns: 1fr;
  }
  .mode-col, .mode-col:not(.mode-col--first), .mode-col--first {
    padding: 24px 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  .mode-col:last-child {
    border-bottom: none;
  }
  .preview-grid {
    grid-template-columns: 1fr;
  }
  .showcase-row {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 980px) {
  .hero {
    min-height: calc(100vh - 64px);
    min-height: max(620px, calc(100svh - 64px));
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: max(580px, calc(100svh - 64px));
    padding: 82px 18px 34px;
    gap: 24px;
  }

  .intro-layout > :not(.hero) {
    width: calc(100% - 32px);
  }

  .hero-badge {
    margin-bottom: 16px;
    font-size: 0.64rem;
  }

  .hero-content h1 {
    font-size: clamp(2.35rem, 10.5vw, 3.2rem);
  }

  .hero-content .lead {
    font-size: 1rem;
  }

  .hero-lines {
    gap: 5px;
    padding: 8px;
  }

  .hero-line-chip {
    padding: 5px 8px;
    font-size: 0.68rem;
  }
}
</style>