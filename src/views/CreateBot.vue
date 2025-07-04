<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
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
  HelpCircle,
  Check,
  AlertCircle
} from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const botsStore = useBotsStore()

const currentStep = ref(1)
const totalSteps = 3

const form = reactive({
  name: '',
  description: '',
  telegram_token: '',
  telegram_group_id: '',
  welcome_message: 'Добро пожаловать! 👋\n\nМы рады, что вы хотите присоединиться к нашей команде. Пожалуйста, ответьте на несколько вопросов, чтобы мы могли лучше вас узнать.',
  welcome_media: '',
  welcome_media_type: '',
  closing_message: '✅ Спасибо за вашу заявку!\n\nМы рассмотрим ваше резюме и свяжемся с вами в ближайшее время.'
})

const errors = ref<Record<string, string>>({})
const isValidating = ref(false)

const validateStep = (step: number) => {
  errors.value = {}
  
  switch (step) {
    case 1:
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
      break
    case 2:
      if (!form.welcome_message.trim()) {
        errors.value.welcome_message = 'Приветственное сообщение обязательно'
      }
      if (!form.closing_message.trim()) {
        errors.value.closing_message = 'Заключительное сообщение обязательно'
      }
      break
  }
  
  return Object.keys(errors.value).length === 0
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const validateBotToken = async () => {
  if (!form.telegram_token) return
  
  isValidating.value = true
  try {
    // Here you would typically make an API call to validate the token
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation - check basic format
    if (!form.telegram_token.includes(':') || form.telegram_token.length < 40) {
      errors.value.telegram_token = 'Неверный формат токена'
    } else {
      delete errors.value.telegram_token
    }
  } catch (error) {
    errors.value.telegram_token = 'Ошибка проверки токена'
  } finally {
    isValidating.value = false
  }
}

const handleMediaUpload = (event: Event, type: string) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Here you would typically upload the file to your server
    // For now, we'll just store the file name
    form.welcome_media = URL.createObjectURL(file)
    form.welcome_media_type = type
  }
}

const removeMedia = () => {
  form.welcome_media = ''
  form.welcome_media_type = ''
}

const createBot = async () => {
  if (!validateStep(currentStep.value)) return
  
  try {
    const bot = await botsStore.createBot(form)
    if (bot) {
      router.push(`/bots/${bot.id}/questions`)
    }
  } catch (error) {
    console.error('Failed to create bot:', error)
  }
}

const goBack = () => {
  router.push('/bots')
}
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
          <h1 class="text-3xl font-bold text-gray-900">Создание нового бота</h1>
          <p class="text-gray-600">Настройте вашего HR-бота для сбора резюме</p>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div
            v-for="step in totalSteps"
            :key="step"
            class="flex items-center"
          >
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                step <= currentStep
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              ]"
            >
              <Check v-if="step < currentStep" class="w-5 h-5" />
              <span v-else>{{ step }}</span>
            </div>
            <div
              v-if="step < totalSteps"
              :class="[
                'w-16 h-1 mx-4',
                step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
              ]"
            ></div>
          </div>
        </div>
        <div class="flex justify-between mt-4">
          <span class="text-sm font-medium text-gray-900">Основные настройки</span>
          <span class="text-sm font-medium text-gray-900">Сообщения</span>
          <span class="text-sm font-medium text-gray-900">Завершение</span>
        </div>
      </div>

      <!-- Step Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- Step 1: Basic Settings -->
        <div v-if="currentStep === 1" class="p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Bot class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Основные настройки</h2>
              <p class="text-gray-600">Укажите основную информацию о вашем боте</p>
            </div>
          </div>

          <div class="space-y-6">
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
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Краткое описание назначения бота"
              ></textarea>
            </div>

            <div>
              <label for="telegram_token" class="block text-sm font-medium text-gray-700 mb-2">
                Telegram Bot Token *
              </label>
              <div class="relative">
                <input
                  id="telegram_token"
                  v-model="form.telegram_token"
                  type="text"
                  :class="[
                    'w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
                    errors.telegram_token ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxyz"
                  @blur="validateBotToken"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div v-if="isValidating" class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                  <Check v-else-if="form.telegram_token && !errors.telegram_token" class="w-5 h-5 text-green-500" />
                  <AlertCircle v-else-if="errors.telegram_token" class="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p v-if="errors.telegram_token" class="mt-1 text-sm text-red-600">{{ errors.telegram_token }}</p>
              <p class="mt-1 text-sm text-gray-500">
                Получите токен у <a href="https://t.me/BotFather" target="_blank" class="text-primary-600 hover:text-primary-700">@BotFather</a>
              </p>
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
              <p class="mt-1 text-sm text-gray-500">
                ID группы, куда будут отправляться резюме. Начинается с "-"
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Messages -->
        <div v-if="currentStep === 2" class="p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <HelpCircle class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Настройка сообщений</h2>
              <p class="text-gray-600">Настройте приветственное и заключительное сообщения</p>
            </div>
          </div>

          <div class="space-y-8">
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

        <!-- Step 3: Review -->
        <div v-if="currentStep === 3" class="p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Check class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Проверка настроек</h2>
              <p class="text-gray-600">Убедитесь, что все настройки корректны</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="font-medium text-gray-900 mb-4">Основная информация</h3>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm text-gray-600">Название</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ form.name }}</dd>
                </div>
                <div v-if="form.description">
                  <dt class="text-sm text-gray-600">Описание</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ form.description }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-gray-600">Telegram токен</dt>
                  <dd class="text-sm font-medium text-gray-900 font-mono">{{ form.telegram_token.substring(0, 20) }}...</dd>
                </div>
                <div>
                  <dt class="text-sm text-gray-600">ID группы</dt>
                  <dd class="text-sm font-medium text-gray-900 font-mono">{{ form.telegram_group_id }}</dd>
                </div>
              </dl>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="font-medium text-gray-900 mb-4">Сообщения</h3>
              <div class="space-y-4">
                <div>
                  <dt class="text-sm text-gray-600 mb-2">Приветственное сообщение</dt>
                  <dd class="text-sm text-gray-900 bg-white rounded p-3 border">{{ form.welcome_message }}</dd>
                  <div v-if="form.welcome_media" class="mt-2 text-xs text-gray-500">
                    + {{ form.welcome_media_type === 'image' ? 'Изображение' : form.welcome_media_type === 'video' ? 'Видео' : 'Аудио' }}
                  </div>
                </div>
                <div>
                  <dt class="text-sm text-gray-600 mb-2">Заключительное сообщение</dt>
                  <dd class="text-sm text-gray-900 bg-white rounded p-3 border">{{ form.closing_message }}</dd>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <HelpCircle class="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 class="text-sm font-medium text-blue-900">Что дальше?</h4>
                  <p class="text-sm text-blue-700 mt-1">
                    После создания бота вы сможете настроить вопросы для кандидатов. 
                    Бот будет создан в неактивном состоянии, активируйте его после полной настройки.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="border-t border-gray-200 px-8 py-6">
          <div class="flex justify-between">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {{ t('common.previous') }}
            </button>
            <div v-else></div>

            <div class="flex space-x-3">
              <button
                @click="goBack"
                class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {{ t('common.cancel') }}
              </button>
              
              <button
                v-if="currentStep < totalSteps"
                @click="nextStep"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {{ t('common.next') }}
              </button>
              
              <button
                v-else
                @click="createBot"
                :disabled="botsStore.loading"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!botsStore.loading">Создать бота</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>