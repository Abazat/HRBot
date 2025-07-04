<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { Eye, EyeOff, Bot, Users, Zap, Info } from 'lucide-vue-next'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showDemoInfo = ref(true)
const form = reactive({
  username: '',
  password: ''
})

const demoAccounts = [
  { username: 'demo', password: 'demo', name: 'Демо Пользователь', company: 'IT Solutions LLC' },
  { username: 'admin', password: 'password', name: 'Администратор', company: 'HR Bot Constructor' },
  { username: 'recruiter', password: 'demo', name: 'Анна Рекрутер', company: 'Tech Startup Inc' }
]

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

const fillDemoCredentials = (account: any) => {
  form.username = account.username
  form.password = account.password
}

const handleLogin = async () => {
  const success = await authStore.login(form)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
    <!-- Left Panel - Features -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10 flex flex-col justify-center p-12">
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bot class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">HR Bot Constructor</h1>
              <p class="text-white/80">{{ t('login.subtitle') }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Bot class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-2">{{ t('login.feature1.title') }}</h3>
              <p class="text-white/80">{{ t('login.feature1.description') }}</p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Users class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-2">{{ t('login.feature2.title') }}</h3>
              <p class="text-white/80">{{ t('login.feature2.description') }}</p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Zap class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-2">{{ t('login.feature3.title') }}</h3>
              <p class="text-white/80">{{ t('login.feature3.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Language Selector -->
        <div class="flex justify-center space-x-2 mb-8">
          <button
            v-for="lang in ['ru', 'uz', 'en']"
            :key="lang"
            @click="changeLanguage(lang)"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              locale === lang
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            ]"
          >
            {{ lang.toUpperCase() }}
          </button>
        </div>

        <!-- Demo Info Banner -->
        <div v-if="showDemoInfo" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3">
            <Info class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <h4 class="text-sm font-medium text-blue-900 mb-2">🎯 Демо версия платформы</h4>
              <p class="text-sm text-blue-700 mb-3">
                Используйте один из тестовых аккаунтов для входа:
              </p>
              <div class="space-y-2">
                <div
                  v-for="account in demoAccounts"
                  :key="account.username"
                  class="bg-white rounded p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  @click="fillDemoCredentials(account)"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="text-xs font-medium text-gray-900">{{ account.name }}</div>
                      <div class="text-xs text-gray-600">{{ account.company }}</div>
                    </div>
                    <div class="text-xs text-blue-600 font-mono">
                      {{ account.username }} / {{ account.password }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              @click="showDemoInfo = false"
              class="text-blue-400 hover:text-blue-600"
            >
              ×
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bot class="w-8 h-8 text-primary-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('login.title') }}</h2>
            <p class="text-gray-600">{{ t('login.description') }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('login.username') }}
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                :placeholder="t('login.usernamePlaceholder')"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('login.password') }}
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  :placeholder="t('login.passwordPlaceholder')"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-600 text-sm">{{ authStore.error }}</p>
            </div>

            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!authStore.loading">{{ t('login.submit') }}</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('login.loading') }}
              </span>
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-center text-sm text-gray-600">
              {{ t('login.registerPrompt') }}
              <a href="https://t.me/hr_constructor_bot" class="text-primary-600 hover:text-primary-500 font-medium">
                @hr_constructor_bot
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>