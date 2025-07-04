<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBotsStore } from '../stores/bots'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import {
  Bot,
  ArrowLeft,
  Upload,
  Image,
  Video,
  Music,
  Save,
  AlertCircle,
  Check
} from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const botsStore = useBotsStore()

const botId = route.params.id as string
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  name: '',
  description: '',
  telegram_token: '',
  telegram_group_id: '',
  welcome_message: '',
  welcome_media: '',
  welcome_media_type: '',
  closing_message: ''
})

const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Название бота обязательно'
  }
  if (!form.telegram_token.trim()) {
    errors.value.telegram_token = 'Telegram токен обязателен'
  } else if (!form.telegram_token.includes(':')) {
    errors.value.telegram_token = 'Неверный формат токена'
  }
  if (!form.telegram_group_id.trim()) {
    errors.value.telegram_group_id = 'ID группы обязателен'
  } else if (!form.telegram_group_id.startsWith('-')) {
    errors.value.telegram_group_id = 'ID группы должен начинаться с -'
  }
  if (!form.welcome_message.trim()) {
    errors.value.welcome_message = 'Приветственное сообщение обязательно'
  }
  if (!form.closing_message.trim()) {
    errors.value.closing_message = 'Заключительное сообщение обязательно'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleMediaUpload = (event: Event, type: string) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    form.welcome_media = URL.createObjectURL(file)
    form.welcome_media_type = type
  }
}

const removeMedia = () => {
  form.welcome_media = ''
  form.welcome_media_type = ''
}

const saveBot = async () => {
  if (!validateForm()) return
  
  saving.value = true
  try {
    const success = await botsStore.updateBot(botId, form)
    if (success) {
      router.push('/bots')
    }
  } catch (error) {
    console.error('Failed to update bot:', error)
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/bots')
}

onMounted(async () => {
  loading.value = true
  try {
    const bot = await botsStore.fetchBot(botId)
    if (bot) {
      Object.assign(form, {
        name: bot.name,
        description: bot.description || '',
        telegram_token: bot.telegram_token,
        telegram_group_id: bot.telegram_group_id,
        welcome_message: bot.welcome_message,
        welcome_media: bot.welcome_media || '',
        welcome_media_type: bot.welcome_media_type || '',
        closing_message: bot.closing_message
      })
    }
  } catch (error) {
    console.error('Failed to fetch bot:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Layout>
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Редактирование бота</h1>
          <p class="text-gray-600">Измените настройки вашего HR-бота</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Edit Form -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bot class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Настройки бота</h2>
              <p class="text-gray-600">Обновите информацию о вашем боте</p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Название бота *
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Например: Бот для подбора разработчиков"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Описание (опционально)
                </label>
                <input
                  id="description"
                  v-model="form.description"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Краткое описание назначения бота"
                />
              </div>
            </div>

            <!-- Telegram Settings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="telegram_token" class="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Bot Token *
                </label>
                <input
                  id="telegram_token"
                  v-model="form.telegram_token"
                  type="text"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.telegram_token ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxyz"
                />
                <p v-if="errors.telegram_token" class="mt-1 text-sm text-red-600">{{ errors.telegram_token }}</p>
              </div>

              <div>
                <label for="telegram_group_id" class="block text-sm font-medium text-gray-700 mb-2">
                  ID Telegram группы *
                </label>
                <input
                  id="telegram_group_id"
                  v-model="form.telegram_group_id"
                  type="text"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.telegram_group_id ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="-1001234567890"
                />
                <p v-if="errors.telegram_group_id" class="mt-1 text-sm text-red-600">{{ errors.telegram_group_id }}</p>
              </div>
            </div>

            <!-- Welcome Message -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Приветственное сообщение</h3>
              
              <div class="mb-4">
                <label for="welcome_message" class="block text-sm font-medium text-gray-700 mb-2">
                  Текст сообщения *
                </label>
                <textarea
                  id="welcome_message"
                  v-model="form.welcome_message"
                  rows="4"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.welcome_message ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Добро пожаловать! Пожалуйста, ответьте на несколько вопросов..."
                ></textarea>
                <p v-if="errors.welcome_message" class="mt-1 text-sm text-red-600">{{ errors.welcome_message }}</p>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Медиа файл (опционально)
                </label>
                
                <div v-if="!form.welcome_media" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label class="cursor-pointer">
                    <input type="file" accept="image/*" @change="handleMediaUpload($event, 'image')" class="hidden" />
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-300 transition-colors">
                      <Image class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span class="text-sm text-gray-600">Изображение</span>
                    </div>
                  </label>
                  
                  <label class="cursor-pointer">
                    <input type="file" accept="video/*" @change="handleMediaUpload($event, 'video')" class="hidden" />
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-300 transition-colors">
                      <Video class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span class="text-sm text-gray-600">Видео</span>
                    </div>
                  </label>
                  
                  <label class="cursor-pointer">
                    <input type="file" accept="audio/*" @change="handleMediaUpload($event, 'audio')" class="hidden" />
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-300 transition-colors">
                      <Music class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span class="text-sm text-gray-600">Аудио</span>
                    </div>
                  </label>
                </div>

                <div v-if="form.welcome_media" class="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Image v-if="form.welcome_media_type === 'image'" class="w-5 h-5 text-primary-600" />
                        <Video v-else-if="form.welcome_media_type === 'video'" class="w-5 h-5 text-primary-600" />
                        <Music v-else class="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ form.welcome_media_type === 'image' ? 'Изображение' : form.welcome_media_type === 'video' ? 'Видео' : 'Аудио' }} загружено
                        </p>
                        <p class="text-xs text-gray-500">Медиа будет отображаться перед приветственным сообщением</p>
                      </div>
                    </div>
                    <button
                      @click="removeMedia"
                      class="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Closing Message -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Заключительное сообщение</h3>
              
              <div>
                <label for="closing_message" class="block text-sm font-medium text-gray-700 mb-2">
                  Текст сообщения *
                </label>
                <textarea
                  id="closing_message"
                  v-model="form.closing_message"
                  rows="3"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.closing_message ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время."
                ></textarea>
                <p v-if="errors.closing_message" class="mt-1 text-sm text-red-600">{{ errors.closing_message }}</p>
                <p class="mt-1 text-sm text-gray-500">
                  Это сообщение будет отправлено после того, как кандидат ответит на все вопросы
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t border-gray-200 px-8 py-6">
          <div class="flex justify-between">
            <button
              @click="goBack"
              class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
            
            <button
              @click="saveBot"
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
        </div>
      </div>
    </div>
  </Layout>
</template>