<script setup>
const imagenes = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Telef%C3%A9rico_La_Paz_-_El_Alto.jpg/1280px-Telef%C3%A9rico_La_Paz_-_El_Alto.jpg',
  heroAlt: 'Teleférico de La Paz y El Alto en funcionamiento',
}
</script>

<template>
  <section class="view application-view">

    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">05 · SIMULADOR DE RUTAS</span>
      </div>
      <h1>Aplicación</h1>
      <p class="lead">
        El modelo de Dijkstra implementado sobre <code>redLaPaz.json</code> permite
        calcular rutas de menor tiempo combinando teleférico, minibús y caminata.
        Aquí se describe cómo funciona el simulador antes de abrirlo.
      </p>
    </header>

    <figure class="hero-media">
      <img
        :src="imagenes.hero"
        :alt="imagenes.heroAlt"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
      <figcaption>
        <span class="caption-label">IMAGEN</span>
        Red de teleférico urbano La Paz – El Alto, la más extensa del mundo.
        <span class="caption-credit">Wikimedia Commons · CC BY-SA</span>
      </figcaption>
    </figure>

    <section class="what-section">
      <div class="block-head">
        <h2>¿Qué hace el simulador?</h2>
        <span class="mono-pill">FLUJO</span>
      </div>

      <div class="flow-grid">
        <article class="flow-col flow-col--first">
          <span class="flow-step">01</span>
          <h3>Elegir origen y destino</h3>
          <p>El usuario selecciona dos nodos del grafo: estaciones de teleférico o puntos clave de la ciudad.</p>
        </article>
        <article class="flow-col">
          <span class="flow-step">02</span>
          <h3>Seleccionar escenario</h3>
          <p>Normal, Hora pico o Paro. Cada escenario aplica pesos distintos a las aristas del grafo.</p>
        </article>
        <article class="flow-col">
          <span class="flow-step">03</span>
          <h3>Calcular con Dijkstra</h3>
          <p>El algoritmo recorre el grafo y devuelve el camino de menor tiempo acumulado en minutos.</p>
        </article>
        <article class="flow-col">
          <span class="flow-step">04</span>
          <h3>Visualizar el resultado</h3>
          <p>El recorrido se anima sobre el mapa y se muestra el detalle paso a paso del viaje.</p>
        </article>
      </div>
    </section>

    <section class="diagram-section">
      <div class="block-head">
        <h2>Flujo de cálculo</h2>
        <span class="mono-pill">GRAFO → DIJKSTRA → RUTA</span>
      </div>

      <div class="diagram-svg" aria-hidden="true">
        <svg viewBox="0 0 760 170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="55" width="140" height="60" rx="10" fill="#9b72e8" fill-opacity="0.12" stroke="#9b72e8" stroke-opacity="0.5" />
          <text x="90" y="80" fill="#c4b5fd" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" text-anchor="middle">ORIGEN + DESTINO</text>
          <text x="90" y="96" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5" text-anchor="middle">nodos del grafo</text>

          <line x1="170" y1="85" x2="220" y2="85" stroke="#9b72e8" stroke-width="2" stroke-linecap="round" />

          <rect x="230" y="55" width="140" height="60" rx="10" fill="#ec4899" fill-opacity="0.12" stroke="#ec4899" stroke-opacity="0.5" />
          <text x="300" y="80" fill="#f472b6" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" text-anchor="middle">ESCENARIO</text>
          <text x="300" y="96" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5" text-anchor="middle">normal · pico · paro</text>

          <line x1="380" y1="85" x2="430" y2="85" stroke="#ec4899" stroke-width="2" stroke-linecap="round" />

          <rect x="440" y="55" width="140" height="60" rx="10" fill="#22c55e" fill-opacity="0.12" stroke="#22c55e" stroke-opacity="0.5" />
          <text x="510" y="80" fill="#4ade80" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" text-anchor="middle">DIJKSTRA</text>
          <text x="510" y="96" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5" text-anchor="middle">O((V+E) log V)</text>

          <line x1="590" y1="85" x2="640" y2="85" stroke="#22c55e" stroke-width="2" stroke-linecap="round" />

          <rect x="650" y="55" width="90" height="60" rx="10" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-opacity="0.5" />
          <text x="695" y="80" fill="#7dd3fc" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" text-anchor="middle">RUTA</text>
          <text x="695" y="96" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5" text-anchor="middle">+ tiempo</text>

          <text x="380" y="140" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle" opacity="0.7">
            Cada arista se pondera en minutos reales según el escenario activo
          </text>
        </svg>
      </div>
    </section>

    <!-- MAPA ESQUEMÁTICO DE LA RED (en vez de galería genérica) -->
    <section class="network-section">
      <div class="block-head">
        <h2>Red modelada</h2>
        <span class="mono-pill">10 LÍNEAS · 26 ESTACIONES</span>
      </div>

      <div class="network-canvas" aria-hidden="true">
        <svg viewBox="0 0 760 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineRoja" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#ef4444" />
              <stop offset="100%" stop-color="#f97316" />
            </linearGradient>
            <linearGradient id="lineAmarilla" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#facc15" />
            </linearGradient>
            <linearGradient id="lineVerde" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#22c55e" />
              <stop offset="100%" stop-color="#4ade80" />
            </linearGradient>
            <linearGradient id="lineAzul" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
            <linearGradient id="lineMorada" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#a855f7" />
              <stop offset="100%" stop-color="#c084fc" />
            </linearGradient>
          </defs>

          <!-- Línea Roja: Ceja → Centro → Zona Sur -->
          <path d="M60 90 L200 70 L340 130 L480 150 L640 180" stroke="url(#lineRoja)" stroke-width="4" stroke-linecap="round" />

          <!-- Línea Amarilla: cruce horizontal -->
          <path d="M100 200 L260 180 L420 200 L620 220" stroke="url(#lineAmarilla)" stroke-width="4" stroke-linecap="round" />

          <!-- Línea Verde: hacia UCB / Obrajes -->
          <path d="M340 130 L420 230 L560 260" stroke="url(#lineVerde)" stroke-width="4" stroke-linecap="round" />

          <!-- Línea Azul: conexión al Alto -->
          <path d="M200 70 L160 40 L100 60" stroke="url(#lineAzul)" stroke-width="4" stroke-linecap="round" />

          <!-- Línea Morada: ramal centro -->
          <path d="M340 130 L360 250 L500 270" stroke="url(#lineMorada)" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 6" opacity="0.85" />

          <!-- Estaciones (círculos) -->
          <!-- Roja -->
          <circle cx="60" cy="90" r="9" fill="#0f0a1a" stroke="#ef4444" stroke-width="3" />
          <text x="60" y="70" fill="#ef4444" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">CEJA</text>

          <circle cx="200" cy="70" r="9" fill="#0f0a1a" stroke="#ef4444" stroke-width="3" />
          <text x="200" y="50" fill="#ef4444" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">16 DE JULIO</text>

          <circle cx="340" cy="130" r="11" fill="#0f0a1a" stroke="#a855f7" stroke-width="3" />
          <text x="340" y="112" fill="#c084fc" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">CENTRAL</text>

          <circle cx="480" cy="150" r="9" fill="#0f0a1a" stroke="#ef4444" stroke-width="3" />
          <text x="480" y="132" fill="#ef4444" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">MIRAFLORES</text>

          <circle cx="640" cy="180" r="9" fill="#0f0a1a" stroke="#f97316" stroke-width="3" />
          <text x="640" y="162" fill="#f97316" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">CALACOTO</text>

          <!-- Amarilla -->
          <circle cx="100" cy="200" r="9" fill="#0f0a1a" stroke="#eab308" stroke-width="3" />
          <text x="100" y="222" fill="#eab308" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">LIBERTADOR</text>

          <circle cx="260" cy="180" r="9" fill="#0f0a1a" stroke="#eab308" stroke-width="3" />
          <text x="260" y="200" fill="#eab308" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">OBELISCO</text>

          <circle cx="420" cy="200" r="9" fill="#0f0a1a" stroke="#eab308" stroke-width="3" />
          <text x="420" y="220" fill="#eab308" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">SAN JORGE</text>

          <circle cx="620" cy="220" r="9" fill="#0f0a1a" stroke="#eab308" stroke-width="3" />
          <text x="620" y="240" fill="#eab308" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">IRPAVI</text>

          <!-- Verde -->
          <circle cx="560" cy="260" r="9" fill="#0f0a1a" stroke="#22c55e" stroke-width="3" />
          <text x="560" y="280" fill="#4ade80" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">UCB OBRAJES</text>

          <!-- Azul -->
          <circle cx="100" cy="60" r="9" fill="#0f0a1a" stroke="#3b82f6" stroke-width="3" />
          <text x="100" y="42" fill="#3b82f6" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">EL ALTO</text>

          <!-- Morada -->
          <circle cx="360" cy="250" r="9" fill="#0f0a1a" stroke="#a855f7" stroke-width="3" />
          <text x="360" y="270" fill="#c084fc" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">PERIFÉRICA</text>

          <circle cx="500" cy="270" r="9" fill="#0f0a1a" stroke="#a855f7" stroke-width="3" />
          <text x="500" y="290" fill="#c084fc" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" text-anchor="middle">ALTO OBRAJES</text>

          <!-- Leyenda -->
          <g font-family="JetBrains Mono, monospace" font-size="9" fill="#b5b0c4">
            <line x1="20" y1="285" x2="40" y2="285" stroke="url(#lineRoja)" stroke-width="3" stroke-linecap="round" />
            <text x="46" y="288">Roja</text>
            <line x1="90" y1="285" x2="110" y2="285" stroke="url(#lineAmarilla)" stroke-width="3" stroke-linecap="round" />
            <text x="116" y="288">Amarilla</text>
            <line x1="170" y1="285" x2="190" y2="285" stroke="url(#lineVerde)" stroke-width="3" stroke-linecap="round" />
            <text x="196" y="288">Verde</text>
            <line x1="240" y1="285" x2="260" y2="285" stroke="url(#lineAzul)" stroke-width="3" stroke-linecap="round" />
            <text x="266" y="288">Azul</text>
            <line x1="300" y1="285" x2="320" y2="285" stroke="url(#lineMorada)" stroke-width="3" stroke-linecap="round" />
            <text x="326" y="288">Morada</text>
          </g>
        </svg>
      </div>

      <p class="network-note">
        Las 10 líneas de Mi Teleférico conectan El Alto, la Ceja, el Centro y la Zona Sur
        con 26 estaciones. El simulador modela una versión simplificada de esta red
        ponderando cada tramo en minutos.
      </p>
    </section>

    <section class="preview-section">
      <div class="block-head">
        <h2>Qué encontrarás al abrirlo</h2>
        <span class="mono-pill">CONTENIDO</span>
      </div>
      <ul class="preview-list">
        <li><strong>Mapa interactivo</strong> con la red de teleférico y los puntos clave de La Paz.</li>
        <li><strong>Selectores de origen y destino</strong> con todas las estaciones y puntos extra.</li>
        <li><strong>Botones de escenario</strong> para alternar entre Normal, Hora pico y Paro.</li>
        <li><strong>Animación del recorrido</strong> sobre el mapa, repetible con un botón.</li>
        <li><strong>Detalle paso a paso</strong> del viaje: fila, líneas, caminatas y minibuses.</li>
        <li><strong>Traza de Dijkstra</strong> expandible para ver cómo se calculó la ruta.</li>
        <li><strong>Comparación entre escenarios</strong> sobre el mismo par origen–destino.</li>
      </ul>
    </section>

    <div class="cta-section">
      <RouterLink class="cta-button" to="/aplicacion/simulador">
        <span>Abrir simulador interactivo</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </div>

  </section>
</template>

<style scoped>
/* ============================================================
   RESET DEL CONTENEDOR DE LA VISTA
   ============================================================ */
.application-view {
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 5vw, 60px);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

/* ============ HEADING ============ */
.kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.kicker-line {
  width: 24px;
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

.section-heading h1 {
  font-size: clamp(2rem, 4.2vw, 3.1rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
  font-weight: 800;
  color: var(--text-primary);
}

.section-heading .lead {
  font-size: clamp(0.98rem, 1.1vw, 1.06rem);
  line-height: 1.65;
  max-width: 64ch;
  color: var(--text-secondary);
  margin: 0;
}

.section-heading code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--accent-soft-bg);
  color: var(--accent-green);
}

/* ============ HERO MEDIA ============ */
.hero-media {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-media img {
  width: 100%;
  aspect-ratio: 21 / 9;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.hero-media figcaption {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.caption-label {
  display: inline-block;
  margin-right: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-solid);
}

.caption-credit {
  opacity: 0.55;
  margin-left: 4px;
}

/* ============ BLOCK HEAD ============ */
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.block-head h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.mono-pill {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--bg-surface-2);
  color: var(--accent-green);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

/* ============ QUÉ HACE (4 columnas) ============ */
.what-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.flow-col {
  padding: 0 24px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flow-col--first {
  padding-left: 0;
}

.flow-col:last-child {
  border-right: none;
  padding-right: 0;
}

.flow-step {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-solid);
}

.flow-col h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--text-primary);
}

.flow-col p {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ DIAGRAMA SVG ============ */
.diagram-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.diagram-svg {
  width: 100%;
}

.diagram-svg svg {
  width: 100%;
  height: auto;
  display: block;
}

/* ============ RED MODELADA (SVG esquemático) ============ */
.network-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.network-canvas {
  width: 100%;
  padding: clamp(8px, 2vw, 20px) 0;
}

.network-canvas svg {
  width: 100%;
  height: auto;
  display: block;
}

.network-note {
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 72ch;
  margin: 0;
}

/* ============ PREVIEW ============ */
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.preview-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 32px;
}

.preview-list li {
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.preview-list strong {
  color: var(--text-primary);
  font-weight: 700;
}

/* ============ CTA ============ */
.cta-section {
  display: flex;
  justify-content: center;
  padding: clamp(16px, 3vw, 28px) 0;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border: none;
  border-radius: 10px;
  background: var(--accent-solid);
  color: #ffffff !important;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  text-decoration: none !important;
  transition: transform 160ms ease, filter 160ms ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.cta-button svg {
  transition: transform 200ms ease;
}

.cta-button:hover svg {
  transform: translateX(3px);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 900px) {
  .flow-grid {
    grid-template-columns: 1fr;
  }

  .flow-col,
  .flow-col--first {
    padding: 18px 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .flow-col:last-child {
    border-bottom: none;
  }

  .preview-list {
    grid-template-columns: 1fr;
  }

  .network-canvas {
    overflow-x: auto;
  }

  .network-canvas svg {
    min-width: 620px;
  }
}
</style>