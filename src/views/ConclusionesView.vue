<script setup>
const scenarioRows = [
  {
    scenario: 'Normal',
    cable: 'Flujo estable; fila moderada al abordar',
    minibus: 'Circula con tiempos base en minutos',
    optimalRule: 'Balance entre tiempo directo y transbordos',
    badgeClass: 'badge-normal',
  },
  {
    scenario: 'Hora pico',
    cable: 'Mayor fila al subir a líneas concurridas',
    minibus: 'Aumenta el tiempo por congestión vial',
    optimalRule: 'Suele favorecer líneas de cable y caminar tramos cortos',
    badgeClass: 'badge-peak',
  },
  {
    scenario: 'Paro / Bloqueo',
    cable: 'Opera como alternativa clave cuando hay vías cerradas',
    minibus: 'Sin circulación (tramos inhabilitados)',
    optimalRule: 'Prioriza teleférico y caminata entre puntos habilitados',
    badgeClass: 'badge-strike',
  },
]

const conclusions = [
  {
    code: 'CONCL · 01',
    title: '¿Puede llevarse a la vida real?',
    accent: '#22c55e',
    text: 'Sí, como base de apoyo a la decisión o prototipo urbano, siempre que los tiempos de fila, tráfico y bloqueos se alimenten con datos reales y actualizados de la ciudad.',
  },
  {
    code: 'CONCL · 02',
    title: 'Cambios entre Normal, Hora pico y Paro',
    accent: '#9b72e8',
    text: 'Al mantener el mismo grafo y modificar solo los pesos en minutos, la ruta óptima cambia cuando suben las filas o cuando los minibuses dejan de circular en un paro.',
  },
  {
    code: 'CONCL · 03',
    title: 'Limitaciones del modelo',
    accent: '#ec4899',
    text: 'Usa tiempos estimados estáticos por escenario (no tráfico en tiempo real minuto a minuto) y simplifica las transiciones multimodales sobre las 26 estaciones y 6 puntos clave.',
  },
  {
    code: 'CONCL · 04',
    title: 'Trabajo futuro',
    accent: '#38bdf8',
    text: 'Integrar datos de tráfico en vivo, afinar los tramos pendientes en redLaPaz.json (como Alto Obrajes → UCB o Libertador → UCB) y ampliar la red a más zonas de La Paz y El Alto.',
  },
]
</script>

<template>
  <section class="view conclusions-view">
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">06 · SÍNTESIS Y COMPARATIVA</span>
      </div>
      <h1>Conclusiones</h1>
      <p class="lead">
        Qué deja aplicar Dijkstra sobre <code>redLaPaz.json</code> al contrastar
        teleférico, minibús y caminata bajo distintos escenarios de La Paz.
      </p>
    </header>

    <!-- Tabla comparativa de escenarios -->
    <article class="card">
      <div class="block-head">
        <h2>Comparación de escenarios en el grafo</h2>
        <span class="mono-pill">MISMO GRAFO · DISTINTOS PESOS</span>
      </div>
      <p class="table-intro">
        La topología se conserva; cambiar de escenario ajusta los tiempos en minutos y
        recalcula qué camino minimiza el total.
      </p>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Escenario</th>
              <th>Teleférico y filas</th>
              <th>Minibús</th>
              <th>Comportamiento de la ruta óptima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in scenarioRows" :key="row.scenario">
              <td>
                <span :class="['scenario-badge', row.badgeClass]">{{ row.scenario }}</span>
              </td>
              <td>{{ row.cable }}</td>
              <td>{{ row.minibus }}</td>
              <td class="mono-note">{{ row.optimalRule }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <!-- 4 bloques de conclusión -->
    <div class="conclusions-grid">
      <article v-for="item in conclusions" :key="item.code" class="card conc-item">
        <div class="conc-top">
          <span class="conc-code" :style="{ color: item.accent }">{{ item.code }}</span>
          <span class="conc-dot" :style="{ background: item.accent }"></span>
        </div>
        <h2>{{ item.title }}</h2>
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

.section-heading code,
.table-intro code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--accent-soft-bg);
  color: var(--accent-green);
}

.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.block-head h2 {
  margin: 0;
}

.mono-pill {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--bg-surface-2);
  color: var(--accent-green);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.scenario-badge {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.badge-normal {
  background: rgba(34, 197, 94, 0.15);
  color: var(--accent-green);
}

.badge-peak {
  background: rgba(155, 114, 232, 0.18);
  color: var(--accent-solid);
}

.badge-strike {
  background: rgba(236, 72, 153, 0.16);
  color: var(--accent-pink);
}

.mono-note {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.conclusions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.conc-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.conc-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.74rem;
  font-weight: 700;
}

.conc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.conc-item h2 {
  margin: 0;
  font-size: 1.15rem;
}

@media (max-width: 900px) {
  .conclusions-grid {
    grid-template-columns: 1fr;
  }
}
</style>