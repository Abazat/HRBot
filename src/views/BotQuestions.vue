<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBotsStore } from '../stores/bots'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  MessageSquare,
  Image,
  Mic,
  Video,
  VideoIcon,
  MousePointer,
  Save,
  Eye,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-vue-next'
import type { Question, QuestionType } from '../types/bot'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const botsStore = useBotsStore()

const botId = route.params.id as string
const loading = ref(true)
const saving = ref(false)
const showQuestionTypeModal = ref(false)
const showQuestionModal = ref(false)
const editingQuestion = ref<Question | null>(null)

const questions = ref<Question[]>([])

const questionForm = reactive({
  text: '',
  type: 'text' as QuestionType,
  required: true,
  options: [''],
  validation_message: ''
})

const questionTypes = [
  { 
    value: 'text', 
    label: 'Matn', 
    icon: MessageSquare,
    description: 'Foydalanuvchi matn yozadi',
    example: 'Ismingiz nima?'
  },
  { 
    value: 'image', 
    label: 'Rasm', 
    icon: Image,
    description: 'Foydalanuvchi rasm yuboradi',
    example: 'Passport rasmini yuboring'
  },
  { 
    value: 'voice', 
    label: 'Ovozli xabar', 
    icon: Mic,
    description: 'Foydalanuvchi ovozli xabar yuboradi',
    example: 'O\'zingiz haqida gapirib bering'
  },
  { 
    value: 'video', 
    label: 'Video', 
    icon: Video,
    description: 'Foydalanuvchi video yuboradi',
    example: 'Qisqa tanishuv videosi yuboring'
  },
  { 
    value: 'video_note', 
    label: 'Video-doira', 
    icon: VideoIcon,
    description: 'Foydalanuvchi video-doira yuboradi',
    example: 'Video-doira orqali salomlashing'
  },
  { 
    value: 'button_choice', 
    label: 'Tugmalar bilan tanlash', 
    icon: MousePointer,
    description: 'Foydalanuvchi tugmalardan birini tanlaydi',
    example: 'Tajribangiz qancha?'
  }
]

const resetQuestionForm = () => {
  questionForm.text = ''
  questionForm.type = 'text'
  questionForm.required = true
  questionForm.options = ['']
  questionForm.validation_message = ''
}

const openQuestionTypeModal = () => {
  showQuestionTypeModal.value = true
}

const selectQuestionType = (type: QuestionType) => {
  questionForm.type = type
  showQuestionTypeModal.value = false
  showQuestionModal.value = true
}

const openQuestionModal = (question?: Question) => {
  if (question) {
    editingQuestion.value = question
    questionForm.text = question.text
    questionForm.type = question.type
    questionForm.required = question.required
    questionForm.options = question.options || ['']
    questionForm.validation_message = question.validation_message || ''
    showQuestionModal.value = true
  } else {
    editingQuestion.value = null
    resetQuestionForm()
    openQuestionTypeModal()
  }
}

const closeQuestionModal = () => {
  showQuestionModal.value = false
  showQuestionTypeModal.value = false
  editingQuestion.value = null
  resetQuestionForm()
}

const addOption = () => {
  questionForm.options.push('')
}

const removeOption = (index: number) => {
  if (questionForm.options.length > 1) {
    questionForm.options.splice(index, 1)
  }
}

const saveQuestion = () => {
  if (!questionForm.text.trim()) return

  const questionData: Question = {
    id: editingQuestion.value?.id || `q_${Date.now()}`,
    text: questionForm.text,
    type: questionForm.type,
    required: questionForm.required,
    order: editingQuestion.value?.order || questions.value.length + 1,
    validation_message: questionForm.validation_message || undefined
  }

  if (questionForm.type === 'button_choice') {
    questionData.options = questionForm.options.filter(opt => opt.trim())
  }

  if (editingQuestion.value) {
    const index = questions.value.findIndex(q => q.id === editingQuestion.value!.id)
    if (index !== -1) {
      questions.value[index] = questionData
    }
  } else {
    questions.value.push(questionData)
  }

  closeQuestionModal()
}

const deleteQuestion = (questionId: string) => {
  questions.value = questions.value.filter(q => q.id !== questionId)
  // Reorder questions
  questions.value.forEach((q, index) => {
    q.order = index + 1
  })
}

const moveQuestion = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex >= 0 && newIndex < questions.value.length) {
    const temp = questions.value[index]
    questions.value[index] = questions.value[newIndex]
    questions.value[newIndex] = temp
    
    // Update order
    questions.value.forEach((q, idx) => {
      q.order = idx + 1
    })
  }
}

const saveQuestions = async () => {
  saving.value = true
  try {
    const success = await botsStore.updateBotQuestions(botId, questions.value)
    if (success) {
      router.push('/bots')
    }
  } catch (error) {
    console.error('Failed to save questions:', error)
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
      questions.value = bot.questions || []
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
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('questions.title') }}</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ t('questions.subtitle') }}</p>
          </div>
        </div>
        <button
          @click="openQuestionModal()"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ t('questions.addQuestion') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Questions List -->
      <div v-else class="space-y-6">
        <div v-if="questions.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <MessageSquare class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('questions.noQuestions') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ t('questions.noQuestionsDesc') }}</p>
          <button
            @click="openQuestionModal()"
            class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            <Plus class="w-4 h-4 mr-2" />
            {{ t('questions.addFirstQuestion') }}
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-start space-x-4">
              <div class="flex flex-col space-y-2">
                <button
                  @click="moveQuestion(index, 'up')"
                  :disabled="index === 0"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp class="w-4 h-4" />
                </button>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ index + 1 }}</span>
                <button
                  @click="moveQuestion(index, 'down')"
                  :disabled="index === questions.length - 1"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown class="w-4 h-4" />
                </button>
              </div>

              <div class="flex-1">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <component
                      :is="questionTypes.find(t => t.value === question.type)?.icon || MessageSquare"
                      class="w-5 h-5 text-primary-600 dark:text-primary-400"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ question.text }}</h3>
                      <div class="flex items-center space-x-2 mt-1">
                        <span class="text-xs px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 rounded">
                          {{ questionTypes.find(t => t.value === question.type)?.label }}
                        </span>
                        <span v-if="question.required" class="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded">
                          Majburiy
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="openQuestionModal(question)"
                      class="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteQuestion(question.id)"
                      class="p-2 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div v-if="question.options && question.options.length > 0" class="mt-3">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Javob variantlari:</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="option in question.options"
                      :key="option"
                      class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {{ option }}
                    </span>
                  </div>
                </div>

                <div v-if="question.validation_message" class="mt-3">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Validatsiya xabari:</strong> {{ question.validation_message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div v-if="questions.length > 0" class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="goBack"
            class="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="saveQuestions"
            :disabled="saving"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save class="w-4 h-4 mr-2" />
            <span v-if="!saving">{{ t('questions.saveQuestions') }}</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('questions.saving') }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Question Type Selection Modal -->
    <div
      v-if="showQuestionTypeModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeQuestionModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-25"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Javob turini tanlang</h3>
            <button
              @click="closeQuestionModal"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="type in questionTypes"
              :key="type.value"
              @click="selectQuestionType(type.value)"
              class="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left group"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
                  <component :is="type.icon" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ type.label }}</h4>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ type.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 italic">Misol: {{ type.example }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Form Modal -->
    <div
      v-if="showQuestionModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeQuestionModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-25"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ editingQuestion ? t('questions.editQuestion') : 'Savol qo\'shish' }}
            </h3>
            <button
              @click="closeQuestionModal"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Selected Type Display -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex items-center space-x-3">
                <component
                  :is="questionTypes.find(t => t.value === questionForm.type)?.icon || MessageSquare"
                  class="w-6 h-6 text-primary-600 dark:text-primary-400"
                />
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    {{ questionTypes.find(t => t.value === questionForm.type)?.label }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ questionTypes.find(t => t.value === questionForm.type)?.description }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label for="question_text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('questions.questionText') }} *
              </label>
              <textarea
                id="question_text"
                v-model="questionForm.text"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :placeholder="t('questions.questionTextPlaceholder')"
              ></textarea>
            </div>

            <div v-if="questionForm.type === 'button_choice'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('questions.answerOptions') }} *
              </label>
              <div class="space-y-2">
                <div
                  v-for="(option, index) in questionForm.options"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="questionForm.options[index]"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    :placeholder="`Variant ${index + 1}`"
                  />
                  <button
                    v-if="questionForm.options.length > 1"
                    @click="removeOption(index)"
                    class="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <button
                  @click="addOption"
                  class="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  <Plus class="w-4 h-4 mr-1" />
                  {{ t('questions.addOption') }}
                </button>
              </div>
            </div>

            <div>
              <label for="validation_message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('questions.validationMessage') }}
              </label>
              <input
                id="validation_message"
                v-model="questionForm.validation_message"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :placeholder="t('questions.validationPlaceholder')"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ t('questions.validationHelp') }}
              </p>
            </div>

            <div class="flex items-center">
              <input
                id="required"
                v-model="questionForm.required"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="required" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ t('questions.required') }}
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-8">
            <button
              @click="closeQuestionModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
            <button
              @click="saveQuestion"
              :disabled="!questionForm.text.trim()"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ editingQuestion ? t('common.update') : t('common.add') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>