<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'
import {
  LayoutDashboard,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Globe,
  Sun,
  Moon
} from 'lucide-vue-next'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const sidebarOpen = ref(false)
const showLanguageDropdown = ref(false)

const navigation = computed(() => [
  { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
  { name: t('nav.bots'), href: '/bots', icon: Bot },
  { name: t('nav.profile'), href: '/profile', icon: User },
])

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  showLanguageDropdown.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors">
    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">HR Constructor</span>
        </div>
        <button
          @click="closeSidebar"
          class="lg:hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="closeSidebar"
          :class="[
            'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
            route.path === item.href || route.path.startsWith(item.href + '/')
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.company_name }}
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut class="w-4 h-4 mr-3" />
          {{ t('nav.logout') }}
        </button>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-0">
      <!-- Top bar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6">
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Menu class="w-6 h-6" />
            </button>

            <div class="hidden sm:block">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  :placeholder="t('search.placeholder')"
                  class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme toggle -->
            <button
              @click="themeStore.toggleTheme"
              class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              :title="themeStore.isDark ? t('nav.light') : t('nav.dark')"
            >
              <Sun v-if="themeStore.isDark" class="w-4 h-4" />
              <Moon v-else class="w-4 h-4" />
            </button>

            <!-- Language selector -->
            <div class="relative">
              <button
                @click="showLanguageDropdown = !showLanguageDropdown"
                class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Globe class="w-4 h-4" />
                <span>{{ locale.toUpperCase() }}</span>
              </button>
              <div
                v-if="showLanguageDropdown"
                class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50"
              >
                <button
                  v-for="lang in ['ru', 'uz', 'en']"
                  :key="lang"
                  @click="changeLanguage(lang)"
                  :class="[
                    'block w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg',
                    locale === lang
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ lang.toUpperCase() }}
                </button>
              </div>
            </div>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell class="w-5 h-5" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>