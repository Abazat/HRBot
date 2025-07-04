<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBotsStore } from '../stores/bots'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import {
  Bot,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Power,
  Settings,
  Users,
  MessageSquare,
  Activity,
  Calendar
} from 'lucide-vue-next'

const { t } = useI18n()
const botsStore = useBotsStore()

const searchQuery = ref('')
const filterStatus = ref('all')
const showDeleteModal = ref(false)
const selectedBot = ref<any>(null)

const filteredBots = computed(() => {
  let filtered = botsStore.bots

  if (searchQuery.value) {
    filtered = filtered.filter(bot =>
      bot.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bot.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(bot =>
      filterStatus.value === 'active' ? bot.is_active : !bot.is_active
    )
  }

  return filtered
})

const toggleBotStatus = async (bot: any) => {
  await botsStore.toggleBotStatus(bot.id)
}

const confirmDelete = (bot: any) => {
  selectedBot.value = bot
  showDeleteModal.value = true
}

const deleteBot = async () => {
  if (selectedBot.value) {
    await botsStore.deleteBot(selectedBot.value.id)
    showDeleteModal.value = false
    selectedBot.value = null
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  botsStore.fetchBots()
})
</script>

<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ t('nav.bots') }}</h1>
          <p class="text-gray-600 mt-1">Управляйте своими HR-ботами</p>
        </div>
        <RouterLink
          to="/bots/create"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus class="w-4 h-4 mr-2" />
          Создать бота
        </RouterLink>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск ботов..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div class="flex items-center space-x-2">
            <Filter class="w-5 h-5 text-gray-400" />
            <select
              v-model="filterStatus"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Все боты</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bots Grid -->
      <div v-if="botsStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="filteredBots.length === 0" class="text-center py-12">
        <Bot class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery || filterStatus !== 'all' ? 'Боты не найдены' : 'Нет ботов' }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ searchQuery || filterStatus !== 'all' ? 'Попробуйте изменить параметры поиска' : 'Создайте своего первого HR-бота для начала работы' }}
        </p>
        <RouterLink
          v-if="!searchQuery && filterStatus === 'all'"
          to="/bots/create"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          Создать первого бота
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          v-for="bot in filteredBots"
          :key="bot.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <!-- Card Header -->
          <div class="p-6 pb-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Bot class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 truncate">{{ bot.name }}</h3>
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-1 text-xs rounded-full',
                      bot.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    ]"
                  >
                    <div
                      :class="[
                        'w-1.5 h-1.5 rounded-full mr-1',
                        bot.is_active ? 'bg-green-500' : 'bg-red-500'
                      ]"
                    ></div>
                    {{ bot.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </div>
              </div>
              <div class="relative">
                <button class="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreHorizontal class="w-5 h-5" />
                </button>
              </div>
            </div>
            <p class="text-gray-600 text-sm mt-3 line-clamp-2">
              {{ bot.description || 'Описание не указано' }}
            </p>
          </div>

          <!-- Stats -->
          <div class="px-6 pb-4">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="flex items-center justify-center">
                  <MessageSquare class="w-4 h-4 text-gray-400 mr-1" />
                  <span class="text-sm font-medium text-gray-900">{{ bot.questions.length }}</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ t('common.questions') }}</p>
              </div>
              <div class="text-center">
                <div class="flex items-center justify-center">
                  <Users class="w-4 h-4 text-gray-400 mr-1" />
                  <span class="text-sm font-medium text-gray-900">{{ bot.stats?.total_applications || 0 }}</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ t('common.applications') }}</p>
              </div>
              <div class="text-center">
                <div class="flex items-center justify-center">
                  <Activity class="w-4 h-4 text-gray-400 mr-1" />
                  <span class="text-sm font-medium text-gray-900">{{ Math.round(bot.stats?.conversion_rate || 0) }}%</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">Конверсия</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center text-xs text-gray-500">
                <Calendar class="w-3 h-3 mr-1" />
                {{ formatDate(bot.created_at) }}
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="toggleBotStatus(bot)"
                  :class="[
                    'p-2 rounded-lg transition-colors',
                    bot.is_active
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-green-600 hover:bg-green-50'
                  ]"
                  :title="bot.is_active ? 'Деактивировать' : 'Активировать'"
                >
                  <Power class="w-4 h-4" />
                </button>
                <RouterLink
                  :to="`/bots/${bot.id}/questions`"
                  class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Настроить вопросы"
                >
                  <Settings class="w-4 h-4" />
                </RouterLink>
                <RouterLink
                  :to="`/bots/${bot.id}/edit`"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Редактировать"
                >
                  <Edit class="w-4 h-4" />
                </RouterLink>
                <button
                  @click="confirmDelete(bot)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="showDeleteModal = false"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-25"></div>
        <div class="relative bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Удалить бота</h3>
          <p class="text-gray-600 mb-6">
            Вы уверены, что хотите удалить бота "{{ selectedBot?.name }}"? Это действие нельзя отменить.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
            <button
              @click="deleteBot"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {{ t('common.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>