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
        <div class="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none">
            <path
              d="M4 21L14 14L24 7"
              stroke="url(#laderaGrad)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="4" cy="21" r="3" fill="#ec4899" />
            <circle cx="14" cy="14" r="3" fill="#38bdf8" />
            <circle cx="24" cy="7" r="3" fill="#22c55e" />
            <defs>
              <linearGradient id="laderaGrad" x1="4" y1="21" x2="24" y2="7" gradientUnits="userSpaceOnUse">
                <stop stop-color="#ec4899" />
                <stop offset="0.5" stop-color="#a855f7" />
                <stop offset="1" stop-color="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="brand-text">
          <span class="brand-name">
            Ladera<span class="accent">Flow</span>
          </span>
          <span class="brand-sub">Dijkstra · La Paz</span>
        </div>
      </RouterLink>

      <div class="nav-right">
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

        <button
          class="theme-btn"
          type="button"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
          @click="isDark = !isDark"
        >
          <!-- Sol (en modo oscuro) -->
          <svg
            v-if="isDark"
            viewBox="0 0 24 24"
            width="18"
            height="18"
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
          <!-- Luna (en modo claro) -->
          <svg
            v-else
            viewBox="0 0 24 24"
            width="18"
            height="18"
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
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar.theme-dark {
  --nav-bg: rgba(18, 12, 31, 0.9);
  --nav-border: rgba(192, 132, 252, 0.2);
  --text-main: #f5f3ff;
  --text-muted: #c4b5fd;
  --hover-bg: rgba(236, 72, 153, 0.14);
  --active-bg: rgba(168, 85, 247, 0.22);
  --active-text: #f472b6;
  --accent-grad: linear-gradient(90deg, #f472b6, #a855f7, #4ade80);
  --icon-bg: rgba(168, 85, 247, 0.16);
  --icon-border: rgba(244, 114, 182, 0.35);
  --shadow: 0 8px 24px rgba(9, 4, 20, 0.55);
}

.navbar.theme-light {
  --nav-bg: rgba(252, 250, 255, 0.92);
  --nav-border: rgba(147, 51, 234, 0.16);
  --text-main: #1e1035;
  --text-muted: #6b4c9a;
  --hover-bg: rgba(236, 72, 153, 0.1);
  --active-bg: rgba(168, 85, 247, 0.14);
  --active-text: #be185d;
  --accent-grad: linear-gradient(90deg, #db2777, #7e22ce, #16a34a);
  --icon-bg: rgba(236, 72, 153, 0.1);
  --icon-border: rgba(126, 34, 206, 0.25);
  --shadow: 0 6px 20px rgba(88, 28, 135, 0.08);
}

.navbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--nav-border);
  box-shadow: var(--shadow);
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

.navbar-inner {
  width: 100%;
  padding: 0.7rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-main);
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  padding: 5px;
  background: var(--icon-bg);
  border: 1px solid var(--icon-border);
}

.brand-icon svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.brand-name .accent {
  background: var(--accent-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-sub {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: var(--text-main);
  opacity: 0.86;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.nav-item:hover {
  opacity: 1;
  background: var(--hover-bg);
}

.nav-item.router-link-active {
  opacity: 1;
  color: var(--active-text);
  background: var(--active-bg);
  font-weight: 600;
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 2.5px;
  border-radius: 999px;
  background: var(--accent-grad);
}

.theme-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--nav-border);
  background: var(--hover-bg);
  color: var(--text-main);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.theme-btn:hover {
  transform: scale(1.05);
  border-color: var(--active-text);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid var(--nav-border);
  background: var(--hover-bg);
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: var(--text-main);
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}
.menu-toggle.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 900px) {
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
    padding: 0.85rem 1.5rem 1.1rem;
    background: var(--nav-bg);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--nav-border);
    box-shadow: var(--shadow);
    display: none;
  }

  .nav-links.open {
    display: flex;
  }
}
</style>