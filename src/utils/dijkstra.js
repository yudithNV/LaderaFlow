// ==========================================
// ALGORITMO DE DIJKSTRA
// Calcula el camino mínimo entre dos nodos
// ==========================================

export const calcularDijkstra = (
  nodes,
  edges,
  inicioId,
  destinoId = null
) => {

  // ==========================================
  // 1. VALIDACIONES
  // ==========================================

  if (!nodes || nodes.length === 0) {
    throw new Error('El grafo no tiene nodos.')
  }

  if (!nodes.some(node => node.id === inicioId)) {
    throw new Error('El nodo inicial no existe.')
  }

  if (
    destinoId !== null &&
    !nodes.some(node => node.id === destinoId)
  ) {
    throw new Error('El nodo destino no existe.')
  }

  for (const edge of edges) {
    const peso = Number(edge.weight)

    if (
      edge.weight === null ||
      edge.weight === undefined ||
      String(edge.weight).trim() === '' ||
      !Number.isFinite(peso) ||
      peso < 0
    ) {
      throw new Error(
        'Dijkstra solo permite pesos numéricos mayores o iguales a cero.'
      )
    }

    if (
      !nodes.some(node => node.id === edge.sourceId) ||
      !nodes.some(node => node.id === edge.targetId)
    ) {
      throw new Error(
        'Existe una conexión que contiene nodos inexistentes.'
      )
    }
  }

  // ==========================================
  // 2. INICIALIZAR VARIABLES
  // ==========================================

  const distancias = {}
  const anteriores = {}
  const aristaAnterior = {}
  const visitados = new Set()

  nodes.forEach(node => {
    distancias[node.id] = Infinity
    anteriores[node.id] = null
    aristaAnterior[node.id] = null
  })

  distancias[inicioId] = 0

  // ==========================================
  // 3. EJECUTAR DIJKSTRA
  // ==========================================

  while (visitados.size < nodes.length) {
    let nodoActual = null
    let distanciaMinima = Infinity

    for (const node of nodes) {
      if (
        !visitados.has(node.id) &&
        distancias[node.id] < distanciaMinima
      ) {
        distanciaMinima = distancias[node.id]
        nodoActual = node.id
      }
    }

    if (nodoActual === null) break
    visitados.add(nodoActual)

    const conexiones = edges.filter(
      edge => edge.sourceId === nodoActual
    )

    for (const edge of conexiones) {
      const vecino = edge.targetId
      const peso = Number(edge.weight)

      if (visitados.has(vecino)) continue

      const nuevaDistancia = distancias[nodoActual] + peso

      if (nuevaDistancia < distancias[vecino]) {
        distancias[vecino] = nuevaDistancia
        anteriores[vecino] = nodoActual
        aristaAnterior[vecino] = edge.id
      }
    }
  }

  // ==========================================
  // 4. RECONSTRUIR CAMINO MÍNIMO
  // ==========================================

  const camino = []
  const aristasCamino = []

  if (
    destinoId !== null &&
    distancias[destinoId] !== Infinity
  ) {
    let actual = destinoId

    while (actual !== null) {
      camino.unshift(actual)

      const edgeId = aristaAnterior[actual]
      if (edgeId !== null) aristasCamino.unshift(edgeId)

      actual = anteriores[actual]
    }
  }

  // ==========================================
  // 5. DEVOLVER RESULTADOS
  // ==========================================

  return {
    inicioId,
    destinoId,
    distancias,
    anteriores,
    camino,
    aristasCamino,
    costoTotal: destinoId !== null ? distancias[destinoId] : null,
    distancia: destinoId !== null ? distancias[destinoId] : null,
    alcanzable: destinoId !== null
      ? distancias[destinoId] !== Infinity
      : true
  }
}
