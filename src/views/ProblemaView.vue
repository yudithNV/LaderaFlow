<script setup>
const factors = [
  {
    code: 'FACTOR 01',
    title: 'Filas en el teleférico',
    metric: '+wait al abordar',
    text: 'Subir a una estación implica tiempo de espera en fila. En el grafo, este costo se suma únicamente al iniciar o cambiar de línea, nunca mientras continúas dentro de la misma.',
  },
  {
    code: 'FACTOR 02',
    title: 'Congestión en hora pico',
    metric: '× pesos minibús',
    text: 'El embotellamiento en rutas troncales (Ceja, Centro, Miraflores y accesos a Zona Sur) multiplica los minutos de traslado vehicular frente al flujo normal.',
  },
  {
    code: 'FACTOR 03',
    title: 'Paros y bloqueos viales',
    metric: 'minibús = ∞',
    text: 'Cuando hay bloqueo, los minibuses dejan de circular. El algoritmo invalida esos tramos y obliga a reorganizar el viaje combinando cable y caminata.',
  },
]

// ── VIDEO ──────────────────────────────────────────────
// Pega aquí el ID de YouTube (lo que va después de v= en la URL)
const videoId = 'wB6us41g_J4'
const videoTitle = 'Teleférico de La Paz: de la Zona Sur a El Alto'
const videoCaption =
  'Recorrido combinando las líneas verde y amarilla: un ejemplo de viaje con transbordo entre cabinas.'

// ── NOTICIA ────────────────────────────────────────────
const noticia = {
  fuente: 'Fuente periodística',
  fecha: '2024',
  titulo: 'El teleférico como respuesta a la congestión en La Paz',
  extracto:
    'El sistema de cable moviliza a cientos de miles de pasajeros al día y ha reconfigurado la forma en que los paceños se desplazan entre la Ceja, el Centro y la Zona Sur.',
  url: 'https://coprofam.org/2019/10/03/teleferico-en-la-paz-bolivia-gran-salto-tecnologico-para-acortar-distancias/', // ← enlace real a la noticia
}
</script>

<template>
  <section class="view problem-view">

    <!-- 1. CONTEXTO -->
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">02 · PLANTEAMIENTO DEL PROBLEMA</span>
      </div>
      <h1>Por qué la distancia engaña en La Paz</h1>
      <p class="lead">
        Un mapa plano sugiere que la línea recta es la mejor opción, pero en la hoyada
        paceña el costo real se mide en <strong>minutos acumulados</strong>, no en kilómetros.
        La topología de la ciudad, la altitud y la fragilidad del transporte vehicular
        convierten cada trayecto en un problema de optimización dinámica.
      </p>
    </header>

    <!-- 2. PREGUNTA PROBLEMA -->
    <article class="problem-question">
      <span class="q-kicker">PREGUNTA DE INVESTIGACIÓN</span>
      <p class="q-text">
        ¿Cómo determinar la ruta de menor tiempo entre dos puntos de La Paz,
        considerando teleférico, minibús y caminata, cuando los costos de cada tramo
        cambian según la hora pico, las filas de abordaje y los bloqueos viales?
      </p>
      <div class="q-footer">
        <span class="q-meta">Variable de costo: <b>minutos</b></span>
        <span class="q-sep">/</span>
        <span class="q-meta">Escenarios: <b>normal · pico · paro</b></span>
        <span class="q-sep">/</span>
        <span class="q-meta">Modelo: <b>grafo ponderado dirigido</b></span>
      </div>
    </article>

    <!-- 3. VIDEO EMBEBIDO -->
    <figure class="media-figure">
      <div class="video-wrap">
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${videoId}`"
          :title="videoTitle"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <figcaption>
        <span class="caption-label">VIDEO</span>
        {{ videoCaption }}
      </figcaption>
    </figure>

    <!-- 4. COMPARATIVA + NOTICIA (grid 2 col) -->
    <div class="comparison-row">
      <!-- 4a. Paradoja de ruteo -->
      <article class="comparison-block">
        <span class="mono-tag">PARADOJA DE RUTEO</span>
        <h2>Camino corto ≠ Camino más rápido</h2>
        <p>
          Dos puntos cercanos por avenida pueden quedar aislados por un bloqueo o una
          trancadera, mientras que un recorrido más largo en teleférico —con varios
          transbordos— mantiene un tiempo estable. Por eso <strong>LaderaFlow</strong>
          pondera cada arista en minutos y adapta los pesos según el escenario activo.
        </p>

        <div class="comparison-visual" aria-hidden="true">
          <svg viewBox="0 0 340 165" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="14" y="24" fill="#ec4899" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">
              RUTA DIRECTA (MINIBÚS EN HORA PICO)
            </text>
            <line x1="16" y1="42" x2="255" y2="42" stroke="#ec4899" stroke-width="5" stroke-linecap="round" />
            <line x1="255" y1="42" x2="324" y2="42" stroke="#ec4899" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round" />
            <text x="16" y="62" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="10">
              4.2 km · 48 min (tráfico + desvío)
            </text>

            <line x1="14" y1="82" x2="326" y2="82" stroke="currentColor" stroke-opacity="0.1" stroke-width="1" />

            <text x="14" y="106" fill="#22c55e" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">
              RUTA DIJKSTRA (TELEFÉRICO + CAMINATA)
            </text>
            <line x1="16" y1="124" x2="152" y2="124" stroke="#22c55e" stroke-width="5" stroke-linecap="round" />
            <line x1="152" y1="124" x2="324" y2="124" stroke="#22c55e" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round" />
            <text x="16" y="144" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="10">
              6.8 km · 24 min (fila inicial + cable)
            </text>
          </svg>
        </div>
      </article>

      <!-- 4b. Noticia / pull quote -->
      <aside class="news-card">
        <span class="news-label">CONTEXTO PERIODÍSTICO</span>
        <p class="news-extracto">“{{ noticia.extracto }}”</p>
        <div class="news-source">
          <span class="news-fuente">{{ noticia.fuente }}</span>
          <span class="news-fecha">{{ noticia.fecha }}</span>
        </div>
        <a
          class="news-link"
          :href="noticia.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leer la noticia completa →
        </a>
      </aside>
    </div>

    <!-- 5. FACTORES -->
    <div class="factors-section">
      <div class="factors-head">
        <span class="kicker-text">FACTORES QUE COMPLICAN EL RUTEO</span>
      </div>

      <div class="factors-row">
        <article
          v-for="(factor, idx) in factors"
          :key="factor.title"
          class="factor-col"
          :class="{ 'factor-col--first': idx === 0 }"
        >
          <div class="factor-top">
            <span class="factor-code">{{ factor.code }}</span>
            <span class="factor-metric" :style="{ color: factor.accent }">
              {{ factor.metric }}
            </span>
          </div>

          <div class="factor-icon" :style="{ color: factor.accent }" aria-hidden="true">
            <svg v-if="idx === 0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="idx === 1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M3 16h4l3-8 4 11 3-6h4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <circle cx="6" cy="18" r="2.5" />
              <circle cx="18" cy="6" r="2.5" />
              <path d="M8.5 18H13a3 3 0 0 0 3-3V8.5" stroke-linecap="round" />
              <path d="M9 5l4 4M13 5L9 9" stroke-linecap="round" />
            </svg>
          </div>

          <h2>{{ factor.title }}</h2>
          <p>{{ factor.text }}</p>
        </article>
      </div>
    </div>

  </section>
</template>

<style scoped>
.problem-view {
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 5vw, 60px);
  padding: 0;
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
}

.section-heading .lead {
  font-size: clamp(0.98rem, 1.1vw, 1.06rem);
  line-height: 1.65;
  max-width: 62ch;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ PREGUNTA PROBLEMA ============ */
.problem-question {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: clamp(24px, 4vw, 40px) 0;
}

.q-kicker {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent-solid);
  margin-bottom: 16px;
}

.q-text {
  font-size: clamp(1.15rem, 2vw, 1.6rem);
  line-height: 1.45;
  letter-spacing: -0.015em;
  font-weight: 600;
  color: var(--text-primary);
  max-width: 68ch;
  margin: 0 0 20px;
}

.q-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.74rem;
  color: var(--text-secondary);
}

.q-footer b {
  color: var(--text-primary);
  font-weight: 700;
}

.q-sep {
  opacity: 0.3;
}

/* ============ VIDEO ============ */
.media-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--border-color);
}

.video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.media-figure figcaption {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 70ch;
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

/* ============ COMPARATIVA + NOTICIA ============ */
.comparison-row {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
}

.comparison-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mono-tag {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-pink);
}

.comparison-block h2 {
  font-size: clamp(1.35rem, 2.2vw, 1.75rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
  font-weight: 700;
}

.comparison-block p {
  font-size: 0.94rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

.comparison-visual {
  margin-top: 8px;
  color: var(--text-primary);
}

.comparison-visual svg {
  width: 100%;
  height: auto;
  display: block;
}

/* ============ NOTICIA (pull quote editorial) ============ */
.news-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 0 0 24px;
  border-left: 2px solid var(--accent-solid);
  background: transparent;
}

.news-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-solid);
}

.news-extracto {
  font-size: 1.02rem;
  line-height: 1.55;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  font-style: italic;
}

.news-source {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.news-fuente {
  font-weight: 700;
  color: var(--text-primary);
}

.news-fecha {
  opacity: 0.7;
}

.news-link {
  text-decoration: none !important;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent-solid) !important;
  border-bottom: 1px solid transparent;
  align-self: flex-start;
  transition: border-color 0.2s ease;
  padding-bottom: 1px;
}

.news-link:hover {
  border-bottom-color: var(--accent-solid);
}

/* ============ FACTORES COMO COLUMNAS ============ */
.factors-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.factors-head {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.factors-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.factor-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 28px 0 28px;
  border-right: 1px solid var(--border-color);
}

.factor-col--first {
  padding-left: 0;
}

.factor-col:last-child {
  border-right: none;
  padding-right: 0;
}

.factor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.factor-code,
.factor-metric {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
}

.factor-code {
  color: var(--text-secondary);
  letter-spacing: 0.08em;
}

.factor-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: transparent;
  border: none;
}

.factor-col h2 {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.factor-col p {
  font-size: 0.89rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 900px) {
  .comparison-row {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .news-card {
    padding: 18px 0 0 18px;
  }

  .factors-row {
    grid-template-columns: 1fr;
  }

  .factor-col,
  .factor-col--first {
    padding: 20px 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .factor-col:last-child {
    border-bottom: none;
  }
}
</style>