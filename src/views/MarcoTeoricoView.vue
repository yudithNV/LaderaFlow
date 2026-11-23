<script setup>
const steps = [
  {
    code: 'PASO 01',
    title: 'Inicializar distancias',
    text: 'Asignar costo 0 al nodo origen y ∞ (infinito) a los demás nodos del grafo.',
  },
  {
    code: 'PASO 02',
    title: 'Seleccionar el mínimo no visitado',
    text: 'Elegir el nodo pendiente con menor tiempo acumulado hasta el momento.',
  },
  {
    code: 'PASO 03',
    title: 'Relajar aristas vecinas',
    text: 'Si costo(actual) + peso(actual, vecino) < costo(vecino), actualizar distancia y predecesor.',
  },
  {
    code: 'PASO 04',
    title: 'Marcar visitado y avanzar',
    text: 'Fijar el nodo como visitado (su costo ya es óptimo) y repetir hasta completar la red.',
  },
]

const sampleRows = [
  { node: 'A', edges: 'B(4), C(2)', time: '0 min', path: 'A', highlight: true },
  { node: 'B', edges: 'A(4), C(1), D(5)', time: '3 min', path: 'A → C → B', highlight: true },
  { node: 'C', edges: 'A(2), B(1), D(8), E(10)', time: '2 min', path: 'A → C', highlight: true },
  { node: 'D', edges: 'B(5), C(8), E(2)', time: '8 min', path: 'A → C → B → D', highlight: true },
  { node: 'E', edges: 'C(10), D(2)', time: '10 min', path: 'A → C → B → D → E', highlight: true },
]
</script>

<template>
  <section class="view theory-view">
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">04 · FUNDAMENTO ALGORÍTMICO</span>
      </div>
      <h1>Marco teórico: Dijkstra</h1>
      <p class="lead">
        Algoritmo clásico de caminos mínimos en grafos ponderados, aplicado aquí para
        minimizar el tiempo de viaje en minutos sobre la red de La Paz.
      </p>
    </header>

    <!-- 3 pilares -->
    <div class="theory-grid">
      <article class="card">
        <span class="card-kicker">DEFINICIÓN</span>
        <h2>¿Qué es?</h2>
        <p>
          Encuentra el camino de menor costo acumulado desde un nodo origen hacia los demás
          nodos de un grafo conectado.
        </p>
      </article>

      <article class="card">
        <span class="card-kicker">APLICACIÓN</span>
        <h2>¿Para qué sirve?</h2>
        <p>
          Permite elegir rutas óptimas cuando cada tramo tiene un peso medible, como
          minutos de teleférico, minibús o caminata.
        </p>
      </article>

      <article class="card warning-card">
        <span class="card-kicker warning-tag">RESTRICCIÓN</span>
        <h2>Pesos no negativos</h2>
        <p>
          Todos los costos de conexión deben ser <strong>≥ 0</strong>. En el proyecto, la
          fila se suma como costo adicional al subir a una línea, nunca restando tiempo.
        </p>
      </article>
    </div>

    <!-- Pasos del algoritmo -->
    <article class="card">
      <div class="block-head">
        <h2>Funcionamiento paso a paso</h2>
        <span class="mono-pill">GREEDY · RELAJACIÓN</span>
      </div>
      <ol class="steps-list">
        <li v-for="step in steps" :key="step.code">
          <span class="step-badge">{{ step.code }}</span>
          <div class="step-body">
            <strong>{{ step.title }}</strong>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </article>

    <!-- Ejemplo visual de 5 nodos + tabla -->
    <article class="card example-block">
      <div class="example-top">
        <div>
          <span class="card-kicker">SIMULACIÓN BASE</span>
          <h2>Ejemplo de 5 nodos (origen: A)</h2>
          <p class="table-intro">
            Nota: desde <strong>A</strong>, ir a <strong>C</strong> (2 min) y luego a
            <strong>B</strong> (1 min) toma <strong>3 min</strong>, superando el tramo
            directo <strong>A → B</strong> (4 min).
          </p>
        </div>

        <!-- Grafo SVG del ejemplo -->
        <div class="graph-mini" aria-hidden="true">
          <svg viewBox="0 0 320 155" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Aristas secundarias -->
            <line x1="48" y1="42" x2="148" y2="34" stroke="#b5b0c4" stroke-opacity="0.35" stroke-width="1.8" />
            <line x1="48" y1="42" x2="112" y2="118" stroke="#22c55e" stroke-width="2.4" />
            <line x1="112" y1="118" x2="148" y2="34" stroke="#22c55e" stroke-width="2.4" />
            <line x1="148" y1="34" x2="218" y2="54" stroke="#22c55e" stroke-width="2.4" />
            <line x1="112" y1="118" x2="218" y2="54" stroke="#b5b0c4" stroke-opacity="0.3" stroke-width="1.6" />
            <line x1="112" y1="118" x2="278" y2="116" stroke="#b5b0c4" stroke-opacity="0.3" stroke-width="1.6" />
            <line x1="218" y1="54" x2="278" y2="116" stroke="#22c55e" stroke-width="2.4" />

            <!-- Pesos -->
            <g font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#e2dcf2">
              <text x="92" y="30" fill="#b5b0c4">4</text>
              <text x="64" y="88" fill="#4ade80">2</text>
              <text x="136" y="84" fill="#4ade80">1</text>
              <text x="184" y="36" fill="#4ade80">5</text>
              <text x="168" y="96" fill="#b5b0c4">8</text>
              <text x="192" y="132" fill="#b5b0c4">10</text>
              <text x="256" y="78" fill="#4ade80">2</text>
            </g>

            <!-- Nodos -->
            <circle cx="48" cy="42" r="13" fill="#1a1825" stroke="#9b72e8" stroke-width="2.2" />
            <circle cx="148" cy="34" r="13" fill="#1a1825" stroke="#22c55e" stroke-width="2.2" />
            <circle cx="112" cy="118" r="13" fill="#1a1825" stroke="#22c55e" stroke-width="2.2" />
            <circle cx="218" cy="54" r="13" fill="#1a1825" stroke="#22c55e" stroke-width="2.2" />
            <circle cx="278" cy="116" r="13" fill="#1a1825" stroke="#ec4899" stroke-width="2.2" />

            <g font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#f7f5ff" text-anchor="middle">
              <text x="48" y="46">A</text>
              <text x="148" y="38">B</text>
              <text x="112" y="122">C</text>
              <text x="218" y="58">D</text>
              <text x="278" y="120">E</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nodo</th>
              <th>Conexiones</th>
              <th>Costo mínimo desde A</th>
              <th>Ruta óptima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sampleRows" :key="row.node">
              <td><strong class="mono-node">{{ row.node }}</strong></td>
              <td class="mono-cell">{{ row.edges }}</td>
              <td><span class="time-badge">{{ row.time }}</span></td>
              <td class="mono-path">{{ row.path }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <!-- Pseudocódigo y complejidad -->
    <div class="code-grid">
      <article class="card code-card">
        <div class="block-head">
          <h2>Pseudocódigo</h2>
          <span class="mono-pill">ALGORITMO</span>
        </div>
        <pre><code>DIJKSTRA(grafo, origen)
  distancia[origen] = 0
  marcar todos los demás como infinito

  mientras quede un nodo no visitado:
    actual = nodo no visitado con menor distancia
    marcar actual como visitado
    para cada vecino de actual:
      nuevo = distancia[actual] + peso(actual, vecino)
      si nuevo &lt; distancia[vecino]:
        distancia[vecino] = nuevo
        anterior[vecino] = actual
  devolver distancia, anterior</code></pre>
      </article>

      <article class="card complexity-card">
        <span class="card-kicker">RENDIMIENTO</span>
        <h2>Complejidad</h2>
        <p>
          Con cola de prioridad (min-heap), el tiempo es
          <strong>O((V + E) log V)</strong>.
        </p>
        <p class="small">
          En este proyecto, <strong>V</strong> son los puntos/estaciones y <strong>E</strong>
          las conexiones en <code>redLaPaz.json</code>; para 32 nodos el cálculo es
          prácticamente instantáneo en el navegador.
        </p>
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

.card-kicker {
  display: inline-block;
  margin-bottom: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-solid);
}

.warning-tag {
  color: var(--accent-pink);
}

.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
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

.steps-list li {
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--bg-body);
  border: 1px solid var(--border-color);
}

.steps-list li span.step-badge {
  flex: 0 0 auto;
  width: auto;
  height: auto;
  border-radius: 7px;
  padding: 5px 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.step-body strong {
  font-family: "Space Grotesk", sans-serif;
  font-size: 0.98rem;
  color: var(--text-primary);
}

.example-top {
  display: grid;
  grid-template-columns: 1.25fr 0.9fr;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
}

.graph-mini {
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-body);
  padding: 8px;
}

.graph-mini svg {
  width: 100%;
  height: auto;
  display: block;
}

.mono-node {
  font-family: "JetBrains Mono", monospace;
  color: var(--accent-solid);
}

.mono-cell,
.mono-path {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.82rem;
}

.mono-path {
  color: var(--text-primary);
}

.time-badge {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(34, 197, 94, 0.14);
  color: var(--accent-green);
}

.complexity-card code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  color: var(--accent-solid);
}

@media (max-width: 900px) {
  .example-top {
    grid-template-columns: 1fr;
  }
}
</style>