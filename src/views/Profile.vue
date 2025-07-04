<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import {
  User,
  Building,
  Phone,
  Mail,
  Save,
  Eye,
  EyeOff,
  Key,
  Shield
} from 'lucide-vue-next'

const { t } = useI18n()
const authStore = useAuthStore()

const activeTab = ref('profile')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const profileForm = reactive({
  name: '',
  company_name: '',
  phone_number: '',
  email: ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const errors = ref<Record<string, string>>({})
const saving = ref(false)

const validateProfileForm = () => {
  errors.value = {}
  
  if (!profileForm.name.trim()) {
    errors.value.name = 'Имя обязательно'
  }
  if (!profileForm.company_name.trim()) {
    errors.value.company_name = 'Название компании обязательно'
  }
  if (!profileForm.phone_number.trim()) {
    errors.value.phone_number = 'Номер телефона обязателен'
  }
  
  return Object.keys(errors.value).length === 0
}

const validatePasswordForm = () => {
  errors.value = {}
  
  if (!passwordForm.current_password) {
    errors.value.current_password = 'Введите текущий пароль'
  }
  if (!passwordForm.new_password) {
    errors.value.new_password = 'Введите новый пароль'
  } else if (passwordForm.new_password.length < 6) {
    errors.value.new_password = 'Пароль должен содержать минимум 6 символов'
  }
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    errors.value.confirm_password = 'Пароли не совпадают'
  }
  
  return Object.keys(errors.value).length === 0
}

const saveProfile = async () => {
  if (!validateProfileForm()) return
  
  saving.value = true
  try {
    const success = await authStore.updateProfile(profileForm)
    if (success) {
      // Show success message
      console.log('Profile updated successfully')
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (!validatePasswordForm()) return
  
  saving.value = true
  try {
    // API call to change password
    // const success = await authStore.changePassword(passwordForm)
    // if (success) {
      // Reset form
      passwordForm.current_password = ''
      passwordForm.new_password = ''
      passwordForm.confirm_password = ''
      console.log('Password changed successfully')
    // }
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (authStore.user) {
    profileForm.name = authStore.user.name
    profileForm.company_name = authStore.user.company_name
    profileForm.phone_number = authStore.user.phone_number
    profileForm.email = authStore.user.email || ''
  }
})
</script>

<template>
  <Layout>
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ t('nav.profile') }}</h1>
        <p class="text-gray-600">Управляйте настройками вашего аккаунта</p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'profile'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <User class="w-4 h-4" />
                <span>Профиль</span>
              </div>
            </button>
            <button
              @click="activeTab = 'security'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <Shield class="w-4 h-4" />
                <span>Безопасность</span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <User class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Информация профиля</h2>
              <p class="text-gray-600">Обновите данные вашего аккаунта</p>
            </div>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Полное имя *
                </label>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    v-model="profileForm.name"
                    type="text"
                    :class="[
                      'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    ]"
                    placeholder="Введите ваше полное имя"
                  />
                </div>
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <div>
                <label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
                  Название компании *
                </label>
                <div class="relative">
                  <Building class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="company_name"
                    v-model="profileForm.company_name"
                    type="text"
                    :class="[
                      'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.company_name ? 'border-red-300' : 'border-gray-300'
                    ]"
                    placeholder="Введите название компании"
                  />
                </div>
                <p v-if="errors.company_name" class="mt-1 text-sm text-red-600">{{ errors.company_name }}</p>
              </div>

              <div>
                <label for="phone_number" class="block text-sm font-medium text-gray-700 mb-2">
                  Номер телефона *
                </label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone_number"
                    v-model="profileForm.phone_number"
                    type="tel"
                    :class="[
                      'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                      errors.phone_number ? 'border-red-300' : 'border-gray-300'
                    ]"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <p v-if="errors.phone_number" class="mt-1 text-sm text-red-600">{{ errors.phone_number }}</p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email (опционально)
                </label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save class="w-4 h-4 mr-2" />
                <span v-if="!saving">{{ t('common.save') }}</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Shield class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Безопасность</h2>
              <p class="text-gray-600">Измените пароль для защиты аккаунта</p>
            </div>
          </div>

          <form @submit.prevent="changePassword" class="space-y-6 max-w-md">
            <div>
              <label for="current_password" class="block text-sm font-medium text-gray-700 mb-2">
                Текущий пароль *
              </label>
              <div class="relative">
                <Key class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="current_password"
                  v-model="passwordForm.current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  :class="[
                    'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.current_password ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Введите текущий пароль"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showCurrentPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.current_password" class="mt-1 text-sm text-red-600">{{ errors.current_password }}</p>
            </div>

            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700 mb-2">
                Новый пароль *
              </label>
              <div class="relative">
                <Key class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="new_password"
                  v-model="passwordForm.new_password"
                  :type="showNewPassword ? 'text' : 'password'"
                  :class="[
                    'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.new_password ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Введите новый пароль"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showNewPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.new_password" class="mt-1 text-sm text-red-600">{{ errors.new_password }}</p>
              <p class="mt-1 text-sm text-gray-500">Минимум 6 символов</p>
            </div>

            <div>
              <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите новый пароль *
              </label>
              <div class="relative">
                <Key class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirm_password"
                  v-model="passwordForm.confirm_password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :class="[
                    'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Повторите новый пароль"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">{{ errors.confirm_password }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Key class="w-4 h-4 mr-2" />
                <span v-if="!saving">Изменить пароль</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Изменение...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>