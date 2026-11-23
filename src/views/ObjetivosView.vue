<script setup>
const specificObjectives = [
  {
    code: 'OBJ · 01',
    title: 'Modelar la red urbana como grafo',
    tag: 'redLaPaz.json',
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
</script>

<template>
  <section class="view objectives-view">
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">03 · ALCANCE DEL PROYECTO</span>
      </div>
      <h1>Objetivos del estudio</h1>
    </header>

    <!-- Objetivo general con esquema visual -->
    <article class="card general-card">
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

      <!-- Mini diagrama SVG: Entrada -> Grafo Ponderado -> Salida -->
      <div class="general-schema" aria-hidden="true">
        <svg viewBox="0 0 300 175" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="16" width="112" height="44" rx="9" fill="#9b72e8" fill-opacity="0.14" stroke="#9b72e8" stroke-opacity="0.5" />
          <text x="26" y="35" fill="#c4b5fd" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700">GRAFO · 32 NODOS</text>
          <text x="26" y="49" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5">Pesos en minutos</text>

          <rect x="14" y="114" width="112" height="44" rx="9" fill="#ec4899" fill-opacity="0.14" stroke="#ec4899" stroke-opacity="0.5" />
          <text x="26" y="133" fill="#f472b6" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700">ESCENARIO ACTIVO</text>
          <text x="26" y="147" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5">Normal / Pico / Paro</text>

          <path d="M126 38 H162 V87 H182" stroke="#9b72e8" stroke-width="1.8" stroke-linecap="round" />
          <path d="M126 136 H162 V87 H182" stroke="#ec4899" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="162" cy="87" r="3.5" fill="#f7f5ff" />

          <rect x="184" y="56" width="102" height="62" rx="11" fill="#22c55e" fill-opacity="0.15" stroke="#22c55e" stroke-opacity="0.65" />
          <text x="197" y="81" fill="#4ade80" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">DIJKSTRA</text>
          <text x="197" y="96" fill="#f7f5ff" font-family="JetBrains Mono, monospace" font-size="8.5">Ruta mínima</text>
          <text x="197" y="108" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="8.5">+ tiempo total</text>
        </svg>
      </div>
    </article>

    <div class="sub-bar">
      <h2>Objetivos específicos</h2>
      <span class="sub-line"></span>
    </div>

    <div class="spec-grid">
      <article v-for="(item, idx) in specificObjectives" :key="item.code" class="card spec-card">
        <div class="spec-head">
          <span class="spec-code" :style="{ color: item.accent }">{{ item.code }}</span>
          <span class="spec-tag">{{ item.tag }}</span>
        </div>

        <div class="spec-icon" :style="{ color: item.accent }" aria-hidden="true">
          <!-- 0: Grafo / nodos -->
          <svg v-if="idx === 0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <circle cx="5" cy="12" r="2.5" />
            <circle cx="19" cy="6" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path d="M7.3 11l9.4-4M7.3 13l9.4 4" stroke-linecap="round" />
          </svg>
          <!-- 1: Pesos / minutos -->
          <svg v-else-if="idx === 1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 1.5M9 2h6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- 2: Ruta óptima -->
          <svg v-else-if="idx === 2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="M4 18c4 0 4-12 8-12s4 12 8 12" stroke-linecap="round" />
            <circle cx="4" cy="18" r="2" />
            <circle cx="20" cy="18" r="2" />
          </svg>
          <!-- 3: Comparación de escenarios -->
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="M4 20V10M10 20V4M16 20v-7M22 20v-11" stroke-linecap="round" />
          </svg>
        </div>

        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.kicker-line {
  width: 24px;
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

.general-card {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  align-items: center;
  gap: 28px;
  border-left: 4px solid var(--accent-solid);
}

.mono-label {
  display: inline-block;
  margin-bottom: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-green);
}

.general-copy h2 {
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.general-copy p {
  color: var(--text-primary);
  opacity: 0.9;
  font-size: 1.03rem;
}

.general-schema {
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-body);
  padding: 10px;
}

.general-schema svg {
  width: 100%;
  height: auto;
  display: block;
}

.sub-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 4px;
}

.sub-bar h2 {
  margin: 0;
  white-space: nowrap;
}

.sub-line {
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.spec-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.spec-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

.spec-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  color: var(--text-secondary);
  background: var(--bg-surface-2);
  padding: 3px 8px;
  border-radius: 6px;
}

.spec-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-color);
}

.spec-card h3 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.12rem;
  color: var(--text-primary);
}

@media (max-width: 900px) {
  .general-card,
  .spec-grid {
    grid-template-columns: 1fr;
  }
}
</style>