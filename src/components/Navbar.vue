<script setup>
import { ref, onMounted, watch } from 'vue'

const menuOpen = ref(false)
const isDark = ref(true)

const links = [
  { label: 'Introducción', to: '/introduccion' },
  { label: 'Problema', to: '/problema' },
  { label: 'Objetivos', to: '/objetivos' },
  { label: 'Marco teórico', to: '/marco-teorico' },
  { label: 'Aplicación', to: '/aplicacion' },
  { label: 'Conclusiones', to: '/conclusiones' },
]

const applyTheme = (dark) => {
  const theme = dark ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('ladera-theme', theme)
}

onMounted(() => {
  const saved = localStorage.getItem('ladera-theme')
  if (saved === 'light' || saved === 'dark') {
    isDark.value = saved === 'dark'
  }
  applyTheme(isDark.value)
})

watch(isDark, (val) => {
  applyTheme(val)
})
</script>

<template>
  <header class="navbar" :class="isDark ? 'theme-dark' : 'theme-light'">
    <div class="navbar-inner">
      <RouterLink
        class="brand"
        to="/introduccion"
        aria-label="LaderaFlow - Ir a la introducción"
        @click="menuOpen = false"
      >
        <svg class="brand-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M4 21L14 14L24 7"
            stroke="url(#laderaGrad)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="4" cy="21" r="2.6" fill="#ec4899" />
          <circle cx="14" cy="14" r="2.6" fill="#a855f7" />
          <circle cx="24" cy="7" r="2.6" fill="#22c55e" />
          <defs>
            <linearGradient id="laderaGrad" x1="4" y1="21" x2="24" y2="7" gradientUnits="userSpaceOnUse">
              <stop stop-color="#ec4899" />
              <stop offset="0.5" stop-color="#a855f7" />
              <stop offset="1" stop-color="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
        <span class="brand-name">Ladera<span class="brand-flow">Flow</span></span>
      </RouterLink>

      <nav :class="['nav-links', { open: menuOpen }]" aria-label="Navegación principal">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-item"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="nav-tools">
        <button
          class="tool-btn"
          type="button"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          @click="isDark = !isDark"
        >
          <svg
            v-if="isDark"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>

        <button
          :class="['menu-toggle', { active: menuOpen }]"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="Abrir menú de navegación"
          @click="menuOpen = !menuOpen"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar.theme-dark {
  --nav-bg: rgba(14, 10, 24, 0.72);
  --nav-border: rgba(255, 255, 255, 0.07);
  --text-main: #ece9f5;
  --text-muted: #8b7fa6;
  --hover-text: #ffffff;
  --link-active: #f472b6;
  --brand-flow: #a855f7;
  --tool-border: rgba(255, 255, 255, 0.09);
  --tool-bg: rgba(255, 255, 255, 0.04);
  --tool-hover: rgba(255, 255, 255, 0.08);
}

.navbar.theme-light {
  --nav-bg: rgba(250, 248, 255, 0.78);
  --nav-border: rgba(30, 16, 53, 0.08);
  --text-main: #1e1035;
  --text-muted: #7a6a94;
  --hover-text: #1e1035;
  --link-active: #be185d;
  --brand-flow: #7e22ce;
  --tool-border: rgba(30, 16, 53, 0.1);
  --tool-bg: rgba(30, 16, 53, 0.03);
  --tool-hover: rgba(30, 16, 53, 0.06);
}

.navbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-bottom: 1px solid var(--nav-border);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.navbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.65rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-sizing: border-box;
}

/* ===== BRAND ===== */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: var(--text-main);
  flex-shrink: 0;
}

.brand-mark {
  width: 26px;
  height: 26px;
}

.brand-name {
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-main);
}

.brand-flow {
  color: var(--brand-flow);
  font-weight: 800;
}

/* ===== NAV LINKS ===== */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}

/* Reset total: nada de fondo, borde, subrayado, padding raro */
.navbar .nav-links .nav-item,
.navbar .nav-links .nav-item:hover,
.navbar .nav-links .nav-item:focus,
.navbar .nav-links .nav-item:active,
.navbar .nav-links .nav-item.router-link-active,
.navbar .nav-links .nav-item.router-link-exact-active {
  background: transparent !important;
  border: none !important;
  border-bottom: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  outline: none !important;
  text-decoration: none !important;
  padding: 0.35rem 0 !important;
}

/* Por si algún global mete ::before / ::after */
.navbar .nav-links .nav-item::before,
.navbar .nav-links .nav-item::after,
.navbar .nav-links .nav-item.router-link-active::before,
.navbar .nav-links .nav-item.router-link-active::after {
  content: none !important;
  display: none !important;
  background: none !important;
  border: none !important;
}

.nav-item {
  color: var(--text-muted) !important;
  font-size: 0.855rem;
  font-weight: 500;
  letter-spacing: 0.005em;
  transition: color 0.2s ease;
  text-decoration: none !important;
}

.nav-item:hover {
  color: var(--hover-text) !important;
}

/* ACTIVO: SOLO color de texto. Nada más. */
.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  color: var(--link-active) !important;
  font-weight: 600;
}

/* ===== TOOLS ===== */
.nav-tools {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--tool-border);
  background: var(--tool-bg);
  color: var(--text-muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.tool-btn:hover {
  color: var(--text-main);
  background: var(--tool-hover);
}

/* ===== MENU TOGGLE (dos barras) ===== */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  padding: 7px;
  border-radius: 8px;
  border: 1px solid var(--tool-border);
  background: var(--tool-bg);
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  background: var(--text-main);
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(3.25px) rotate(45deg);
}
.menu-toggle.active span:nth-child(2) {
  transform: translateY(-3.25px) rotate(-45deg);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .navbar-inner {
    padding: 0.6rem 1.25rem;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.5rem 0 0.75rem;
    background: var(--nav-bg);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border-bottom: 1px solid var(--nav-border);
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .navbar .nav-links .nav-item {
    padding: 0.85rem 1.25rem !important;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--nav-border) !important;
    border-radius: 0 !important;
    background: transparent !important;
  }

  .navbar .nav-links .nav-item:last-child {
    border-bottom: none !important;
  }

  .navbar .nav-links .nav-item.router-link-active,
  .navbar .nav-links .nav-item.router-link-exact-active {
    color: var(--link-active) !important;
    font-weight: 600;
    background: transparent !important;
    border-left: none !important;
  }
}
</style>