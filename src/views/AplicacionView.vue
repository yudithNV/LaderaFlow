<script setup>
const imagenes = {
  hero: 'https://commons.wikimedia.org/wiki/Special:FilePath/Telef%C3%A9rico_La_Paz_-_El_Alto.jpg',
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
        El modelo de Dijkstra sobre la red de transporte de La Paz permite calcular rutas
        de menor tiempo combinando teleférico, minibús y caminata.
        Aquí se describe cómo funciona el simulador antes de abrirlo.
      </p>
    </header>

    <!-- BOTÓN DEL SIMULADOR (arriba) -->
    <div class="cta-section">
      <RouterLink class="cta-button" to="/aplicacion/simulador">
        <span>Abrir simulador interactivo</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </div>

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

    <!-- RED MODELADA: viaje de ejemplo animado -->
    <section class="network-section">
      <div class="block-head">
        <h2>Red modelada</h2>
        <span class="mono-pill">10 LÍNEAS · 26 ESTACIONES</span>
      </div>

      <div class="network-canvas" role="img" aria-label="Animación de un viaje de ejemplo de Centro a UCB combinando caminata, teleférico y minibús">
        <svg viewBox="0 0 1000 250" fill="none" xmlns="http://www.w3.org/2000/svg">

          <!-- Encabezado del ejemplo -->
          <text class="net-title" x="20" y="30">EJEMPLO · CENTRO → UCB</text>
          <text class="net-total" x="980" y="30" text-anchor="end">TOTAL 24 MIN</text>

          <!-- ===== TRAMOS ===== -->
          <!-- 1. Caminata -->
          <line class="net-walk" x1="90" y1="170" x2="260" y2="170" />
          <!-- 2. Línea Celeste: Del Prado → Del Teatro → Del Poeta → Libertador -->
          <line class="net-cable" x1="260" y1="170" x2="430" y2="170" stroke="#38bdf8" />
          <line class="net-cable" x1="430" y1="170" x2="600" y2="170" stroke="#38bdf8" />
          <line class="net-cable" x1="600" y1="170" x2="770" y2="170" stroke="#38bdf8" />
          <!-- 3. Minibús -->
          <line class="net-road" x1="770" y1="170" x2="920" y2="170" />

          <!-- ===== MINUTOS POR TRAMO ===== -->
          <text class="net-mode" x="175" y="100" text-anchor="middle">A PIE</text>
          <rect class="net-pill" x="137" y="108" width="76" height="24" rx="12" />
          <text class="net-pill-text" x="175" y="124.5" text-anchor="middle">6 min</text>

          <text class="net-mode" x="345" y="100" text-anchor="middle" fill="#38bdf8">CELESTE</text>
          <rect class="net-pill" x="307" y="108" width="76" height="24" rx="12" />
          <text class="net-pill-text" x="345" y="124.5" text-anchor="middle">3 min</text>

          <text class="net-mode" x="515" y="100" text-anchor="middle" fill="#38bdf8">CELESTE</text>
          <rect class="net-pill" x="477" y="108" width="76" height="24" rx="12" />
          <text class="net-pill-text" x="515" y="124.5" text-anchor="middle">3 min</text>

          <text class="net-mode" x="685" y="100" text-anchor="middle" fill="#38bdf8">CELESTE</text>
          <rect class="net-pill" x="647" y="108" width="76" height="24" rx="12" />
          <text class="net-pill-text" x="685" y="124.5" text-anchor="middle">4 min</text>

          <text class="net-mode" x="845" y="100" text-anchor="middle" fill="#f59e0b">MINIBÚS</text>
          <rect class="net-pill" x="807" y="108" width="76" height="24" rx="12" />
          <text class="net-pill-text" x="845" y="124.5" text-anchor="middle">5 min</text>
          <text class="net-sub" x="845" y="146" text-anchor="middle">pico: 8 min</text>
          <text class="net-sub" x="845" y="157" text-anchor="middle">paro: no circula</text>

          <!-- ===== NODOS ===== -->
          <!-- Centro (punto extra, cuadrado) -->
          <rect class="net-node" x="81" y="161" width="18" height="18" rx="4" />
          <text class="net-name" x="90" y="214" text-anchor="middle">Centro</text>
          <text class="net-time" x="90" y="230" text-anchor="middle">min 0</text>

          <circle class="net-node" cx="260" cy="170" r="9" />
          <text class="net-name" x="260" y="214" text-anchor="middle">Del Prado</text>
          <text class="net-time" x="260" y="230" text-anchor="middle">min 6</text>

          <circle class="net-node" cx="430" cy="170" r="9" />
          <text class="net-name" x="430" y="214" text-anchor="middle">Del Teatro</text>
          <text class="net-time" x="430" y="230" text-anchor="middle">min 12</text>

          <circle class="net-node" cx="600" cy="170" r="9" />
          <text class="net-name" x="600" y="214" text-anchor="middle">Del Poeta</text>
          <text class="net-time" x="600" y="230" text-anchor="middle">min 15</text>

          <circle class="net-node" cx="770" cy="170" r="9" />
          <text class="net-name" x="770" y="214" text-anchor="middle">Libertador</text>
          <text class="net-time" x="770" y="230" text-anchor="middle">min 19</text>

          <!-- UCB (punto extra, cuadrado) con pulso al llegar -->
          <rect class="net-node net-node--dest" x="911" y="161" width="18" height="18" rx="4" />
          <circle class="net-pulse" cx="920" cy="170" r="12">
            <animate attributeName="r" values="12;12;26;12" keyTimes="0;0.88;0.95;1" dur="13s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0;0.6;0;0" keyTimes="0;0.88;0.9;0.97;1" dur="13s" repeatCount="indefinite" />
          </circle>
          <text class="net-name" x="920" y="214" text-anchor="middle">UCB</text>
          <text class="net-time" x="920" y="230" text-anchor="middle">min 24</text>

          <!-- ===== PERSONA CAMINANDO (Centro → Obelisco) ===== -->
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="90,158;260,158;260,158"
              keyTimes="0;0.1846;1"
              dur="13s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0;0"
              keyTimes="0;0.03;0.1846;0.2154;1"
              dur="13s"
              repeatCount="indefinite"
            />
            <circle class="icon-fill" cx="0" cy="-12" r="3.5" />
            <path class="icon-line" d="M0 -7 L0 4" />
            <path class="icon-line" d="M0 -4 L-5 2 M0 -4 L5 2">
              <animate
                attributeName="d"
                dur="0.5s"
                repeatCount="indefinite"
                values="M0 -4 L-5 2 M0 -4 L5 2;M0 -4 L0 3 M0 -4 L0 3;M0 -4 L5 2 M0 -4 L-5 2;M0 -4 L0 3 M0 -4 L0 3;M0 -4 L-5 2 M0 -4 L5 2"
              />
            </path>
            <path class="icon-line" d="M0 4 L-4 12 M0 4 L4 12">
              <animate
                attributeName="d"
                dur="0.5s"
                repeatCount="indefinite"
                values="M0 4 L-4 12 M0 4 L4 12;M0 4 L0 12 M0 4 L0 12;M0 4 L4 12 M0 4 L-4 12;M0 4 L0 12 M0 4 L0 12;M0 4 L-4 12 M0 4 L4 12"
              />
            </path>
          </g>

          <!-- ===== CABINA DE TELEFÉRICO CELESTE (con paradas) ===== -->
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="260,170;260,170;430,170;430,170;600,170;600,170;770,170;770,170"
              keyTimes="0;0.2154;0.3538;0.3846;0.5077;0.5385;0.7385;1"
              dur="13s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0;1;1;0;0"
              keyTimes="0;0.2;0.2154;0.7385;0.7615;1"
              dur="13s"
              repeatCount="indefinite"
            />
            <line class="icon-stroke" x1="0" y1="0" x2="0" y2="9" />
            <circle class="icon-wheel" cx="0" cy="0" r="3" />
            <rect class="icon-stroke" x="-15" y="9" width="30" height="20" rx="5" fill="#38bdf8" />
            <rect class="icon-window" x="-11" y="13" width="7" height="7" rx="1.5" />
            <rect class="icon-window" x="4" y="13" width="7" height="7" rx="1.5" />
          </g>

          <!-- ===== MINIBÚS (Libertador → UCB) ===== -->
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="770,163;770,163;920,163;920,163"
              keyTimes="0;0.7615;0.8846;1"
              dur="13s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0;1;1;0;0"
              keyTimes="0;0.7462;0.7615;0.8846;0.9077;1"
              dur="13s"
              repeatCount="indefinite"
            />
            <rect class="icon-stroke" x="-17" y="-14" width="34" height="17" rx="4" fill="#f59e0b" />
            <rect class="icon-window" x="-14" y="-11" width="7" height="5" rx="1" />
            <rect class="icon-window" x="-5.5" y="-11" width="7" height="5" rx="1" />
            <rect class="icon-window" x="3" y="-11" width="7" height="5" rx="1" />
            <circle class="icon-wheel" cx="-9" cy="4" r="3.3" />
            <circle class="icon-wheel" cx="9" cy="4" r="3.3" />
          </g>
        </svg>
      </div>

      <ul class="net-legend" aria-hidden="true">
        <li><i class="lg lg-cable"></i>Teleférico</li>
        <li><i class="lg lg-walk"></i>Caminata</li>
        <li><i class="lg lg-bus"></i>Minibús</li>
        <li><i class="lg lg-point"></i>Punto de la ciudad</li>
      </ul>

      <p class="network-note">
        Ejemplo ilustrativo de Centro a UCB: caminata hasta Del Prado, línea Celeste con paradas
        en Del Teatro y Del Poeta hasta Libertador, y minibús a la UCB. El total estimado de 24 min
        incluye 3 min de fila al abordar; el simulador ajusta los tiempos según el escenario activo.
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

/* ============ CTA (arriba, debajo del título) ============ */
.cta-section {
  display: flex;
  justify-content: flex-start;
  margin-top: calc(clamp(36px, 5vw, 60px) * -0.4);
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

/* ============ RED MODELADA (viaje animado) ============ */
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

/* Tramos */
.net-cable {
  stroke-width: 5;
  stroke-linecap: round;
  fill: none;
}

.net-walk {
  stroke: var(--text-secondary);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 1 9;
  fill: none;
}

.net-road {
  stroke: #f59e0b;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 12 8;
  fill: none;
}

/* Nodos */
.net-node {
  fill: var(--bg-surface);
  stroke: var(--text-primary);
  stroke-width: 3;
}

.net-node--dest {
  stroke: #34d399;
}

.net-pulse {
  fill: none;
  stroke: #34d399;
  stroke-width: 2;
}

/* Textos */
.net-title {
  fill: var(--text-secondary);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.net-total {
  fill: var(--accent-green);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.net-mode {
  fill: var(--text-secondary);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.net-pill {
  fill: var(--bg-surface-2);
  stroke: var(--border-color);
  stroke-width: 1;
}

.net-pill-text {
  fill: var(--text-primary);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  font-weight: 800;
}

.net-sub {
  fill: var(--text-secondary);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  opacity: 0.85;
}

.net-name {
  fill: var(--text-primary);
  font-size: 12px;
  font-weight: 700;
}

.net-time {
  fill: var(--text-secondary);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
}

/* Íconos animados */
.icon-stroke {
  stroke: var(--text-primary);
  stroke-width: 1.8;
  stroke-linecap: round;
}

.icon-window {
  fill: var(--bg-surface);
}

.icon-wheel {
  fill: var(--text-primary);
}

.icon-fill {
  fill: var(--text-primary);
}

.icon-line {
  fill: none;
  stroke: var(--text-primary);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Leyenda */
.net-legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  padding: 0;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.net-legend li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.lg {
  display: inline-block;
}

.lg-cable {
  width: 22px;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, #9333ea, #94a3b8, #eab308);
}

.lg-walk {
  width: 22px;
  height: 0;
  border-top: 3px dotted var(--text-secondary);
}

.lg-bus {
  width: 22px;
  height: 0;
  border-top: 4px dashed #f59e0b;
}

.lg-point {
  width: 10px;
  height: 10px;
  border: 2px solid var(--text-secondary);
  border-radius: 3px;
  background: var(--bg-surface-2);
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
    min-width: 720px;
  }
}
</style>