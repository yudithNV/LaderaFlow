<script setup>
const specificObjectives = [
  {
    code: 'OBJ · 01',
    title: 'Modelar la red urbana como grafo',
    tag: 'Red de transporte',
    accent: '#9b72e8',
    text: 'Representar las 26 estaciones del teleférico (10 líneas) y los 6 puntos clave de La Paz junto con sus conexiones disponibles.',
  },
  {
    code: 'OBJ · 02',
    title: 'Ponderar tiempos y filas reales',
    tag: 'minutos + fila',
    accent: '#ec4899',
    text: 'Asignar pesos en minutos a tramos en teleférico, minibús y caminata, sumando el tiempo de fila únicamente al abordar una línea.',
  },
  {
    code: 'OBJ · 03',
    title: 'Implementar Dijkstra interactivo',
    tag: 'ruta óptima',
    accent: '#38bdf8',
    text: 'Calcular el camino de menor costo temporal entre cualquier origen y destino y visualizar el recorrido animado sobre el mapa.',
  },
  {
    code: 'OBJ · 04',
    title: 'Comparar los tres escenarios',
    tag: 'Normal · Pico · Paro',
    accent: '#22c55e',
    text: 'Evaluar sobre el mismo grafo cómo cambian los tiempos y la ruta óptima cuando varía el tráfico o dejan de circular los minibuses.',
  },
]

// ── Imágenes reales de Mi Teleférico (Wikimedia Commons, CC BY-SA) ──
// Estas URLs son estables y de licencia libre.
const images = {
  hero: 'https://commons.wikimedia.org/wiki/Special:FilePath/Teleferico%20de%20La%20Paz.jpg?width=1280',
  heroAlt: 'Teleférico de La Paz y El Alto en funcionamiento',
  gallery: [
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/EstacionVirgen.jpg?width=1024',
      alt: 'Estación Virgen',
      caption: 'Estación Virgen · Mi Teleférico',
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Estaci%C3%B3n%20Central%20de%20Mi%20Telef%C3%A9rico%20L%C3%ADnea%20Roja%20en%20la%20ciudad%20de%20La%20Paz%20-%20Bolivia%20en%20el%20a%C3%B1o%202019.jpg?width=1024',
      alt: 'Estación Central',
      caption: 'Estación Central · Línea Roja',
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Telef%C3%A9rico%20La%20Paz%20-%20El%20Alto.jpg?width=1024',
      alt: 'Vista del teleférico',
      caption: 'Teleférico sobre La Paz',
    },
  ],
}

// ── Dato duro real para justificar OBJ 02 ──
const telefericoData = {
  pasajeros: '640+ millones',
  anio: '11 años de operación',
  tarifa: 'Bs 3,00',
  lineas: '10 líneas',
}
</script>

<template>
  <section class="view objectives-view">

    <!-- 1. HEADING -->
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">03 · ALCANCE DEL PROYECTO</span>
      </div>
      <h1>Objetivos del estudio</h1>
    </header>

    <!-- 2. IMAGEN HERO REAL -->
    <figure class="hero-media">
      <img
        :src="images.hero"
        :alt="images.heroAlt"
        loading="eager"
        referrerpolicy="no-referrer"
      />
      <figcaption>
        <span class="caption-label">IMAGEN</span>
        Red de teleférico urbano La Paz – El Alto, la más extensa del mundo.
        <span class="caption-credit">Wikimedia Commons · CC BY-SA</span>
      </figcaption>
    </figure>

    <!-- 3. OBJETIVO GENERAL (sin card, con dato duro) -->
    <article class="general-block">
      <div class="general-copy">
        <span class="mono-label">OBJETIVO GENERAL</span>
        <h2>Optimizar el tiempo de traslado multimodal en La Paz</h2>
        <p>
          Determinar la ruta de menor tiempo en minutos entre dos puntos de La Paz
          mediante el algoritmo de Dijkstra, integrando teleférico, minibús y caminata, y
          analizar cómo cambia la decisión óptima bajo tres escenarios operativos:
          <strong>Normal</strong>, <strong>Hora pico</strong> y <strong>Paro</strong>.
        </p>
      </div>

      <div class="general-data">
        <div class="data-row">
          <span class="data-value">{{ telefericoData.pasajeros }}</span>
          <span class="data-label">pasajeros transportados</span>
        </div>
        <div class="data-row">
          <span class="data-value">{{ telefericoData.lineas }}</span>
          <span class="data-label">en operación</span>
        </div>
        <div class="data-row">
          <span class="data-value">{{ telefericoData.tarifa }}</span>
          <span class="data-label">tarifa plana actual</span>
        </div>
        <div class="data-note">
          Datos oficiales de Mi Teleférico reportados en septiembre de 2025
          [<a href="http://spanish.xinhuanet.com/20250902/81f1068f2f4d4d55800781b8065d3efb/c.html" target="_blank" rel="noopener noreferrer">Xinhua</a>].
        </div>
      </div>
    </article>

    <!-- 4. GALERÍA DE IMÁGENES REALES -->
    <div class="gallery-section">
      <div class="gallery-head">
        <span class="kicker-text">REGISTRO VISUAL · RED DE CABLE</span>
      </div>
      <div class="gallery-grid">
        <figure v-for="(img, i) in images.gallery" :key="i" class="gallery-item">
          <img
            :src="img.src"
            :alt="img.alt"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <figcaption>{{ img.caption }}</figcaption>
        </figure>
      </div>
    </div>

    <!-- 5. OBJETIVOS ESPECÍFICOS (columnas, sin cards) -->
    <div class="spec-section">
      <div class="spec-head-bar">
        <h2>Objetivos específicos</h2>
        <span class="spec-line"></span>
      </div>

      <div class="spec-row">
        <article
          v-for="(item, idx) in specificObjectives"
          :key="item.code"
          class="spec-col"
          :class="{ 'spec-col--first': idx === 0 }"
        >
          <div class="spec-top">
            <span class="spec-code" :style="{ color: item.accent }">{{ item.code }}</span>
            <span class="spec-tag">{{ item.tag }}</span>
          </div>

          <div class="spec-icon" :style="{ color: item.accent }" aria-hidden="true">
            <svg v-if="idx === 0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <circle cx="5" cy="12" r="2.5" />
              <circle cx="19" cy="6" r="2.5" />
              <circle cx="19" cy="18" r="2.5" />
              <path d="M7.3 11l9.4-4M7.3 13l9.4 4" stroke-linecap="round" />
            </svg>
            <svg v-else-if="idx === 1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 1.5M9 2h6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="idx === 2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M4 18c4 0 4-12 8-12s4 12 8 12" stroke-linecap="round" />
              <circle cx="4" cy="18" r="2" />
              <circle cx="20" cy="18" r="2" />
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M4 20V10M10 20V4M16 20v-7M22 20v-11" stroke-linecap="round" />
            </svg>
          </div>

          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>

  </section>
</template>

<style scoped>
.objectives-view {
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
  margin: 0;
  font-weight: 800;
}

/* ============ IMAGEN HERO ============ */
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
  max-width: 72ch;
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

/* ============ OBJETIVO GENERAL ============ */
.general-block {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: clamp(28px, 4vw, 48px);
  align-items: start;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.mono-label {
  display: inline-block;
  margin-bottom: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-green);
}

.general-copy h2 {
  font-size: clamp(1.35rem, 2.2vw, 1.75rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
  font-weight: 700;
}

.general-copy p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0;
}

.general-data {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 0 0 24px;
  border-left: 2px solid var(--accent-solid);
}

.data-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.data-value {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.data-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
}

.data-note {
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--text-secondary);
  opacity: 0.75;
  margin-top: 4px;
}

.data-note a {
  color: var(--accent-solid) !important;
  text-decoration: none !important;
  border-bottom: 1px solid transparent;
}

.data-note a:hover {
  border-bottom-color: var(--accent-solid);
}

/* ============ GALERÍA ============ */
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gallery-head {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.gallery-item {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.gallery-item figcaption {
  font-size: 0.76rem;
  line-height: 1.45;
  color: var(--text-secondary);
}

/* ============ OBJETIVOS ESPECÍFICOS ============ */
.spec-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.spec-head-bar {
  display: flex;
  align-items: center;
  gap: 14px;
}

.spec-head-bar h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.spec-line {
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.spec-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.spec-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 24px 0 24px;
  border-right: 1px solid var(--border-color);
}

.spec-col--first {
  padding-left: 0;
}

.spec-col:last-child {
  border-right: none;
  padding-right: 0;
}

.spec-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.spec-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.spec-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.66rem;
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.spec-icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: transparent;
  border: none;
  margin-top: 2px;
}

.spec-col h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--text-primary);
}

.spec-col p {
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ RESPONSIVE ============ */
@media (max-width: 1000px) {
  .spec-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 0;
  }

  .spec-col {
    padding: 0 24px;
  }

  .spec-col:nth-child(2) {
    border-right: none;
    padding-right: 0;
  }

  .spec-col:nth-child(3) {
    padding-left: 0;
    border-right: 1px solid var(--border-color);
  }
}

@media (max-width: 900px) {
  .general-block {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .general-data {
    padding-left: 18px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .spec-row {
    grid-template-columns: 1fr;
  }

  .spec-col,
  .spec-col--first,
  .spec-col:nth-child(3) {
    padding: 16px 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .spec-col:last-child {
    border-bottom: none;
  }
}
</style>