<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBotsStore } from '../stores/bots'
import { useI18n } from 'vue-i18n'
import Layout from '../components/Layout.vue'
import {
  Bot,
  Plus,
  Users,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-vue-next'

const { t } = useI18n()
const botsStore = useBotsStore()

const stats = ref({
  totalBots: 0,
  activeBots: 0,
  totalApplications: 0,
  pendingReviews: 0
})

const recentActivity = ref([
  {
    id: 1,
    type: 'application',
    message: 'New application received for "Frontend Developer Bot"',
    time: '2 minutes ago',
    icon: Users
  },
  {
    id: 2,
    type: 'bot_created',
    message: 'New bot "Marketing Manager Bot" created',
    time: '1 hour ago',
    icon: Bot
  },
  {
    id: 3,
    type: 'application',
    message: 'Application reviewed for "Backend Developer Bot"',
    time: '3 hours ago',
    icon: CheckCircle
  }
])

const chartData = ref({
  applications: [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 19 },
    { day: 'Wed', count: 8 },
    { day: 'Thu', count: 24 },
    { day: 'Fri', count: 16 },
    { day: 'Sat', count: 7 },
    { day: 'Sun', count: 11 }
  ]
})

const quickActions = computed(() => [
  {
    name: t('dashboard.quickActions.createBot'),
    description: t('dashboard.quickActions.createBotDesc'),
    href: '/bots/create',
    icon: Plus,
    color: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
  },
  {
    name: t('dashboard.quickActions.viewBots'),
    description: t('dashboard.quickActions.viewBotsDesc'),
    href: '/bots',
    icon: Bot,
    color: 'bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-600'
  },
  {
    name: t('dashboard.quickActions.analytics'),
    description: t('dashboard.quickActions.analyticsDesc'),
    href: '/analytics',
    icon: BarChart3,
    color: 'bg-accent-600 hover:bg-accent-700 dark:bg-accent-700 dark:hover:bg-accent-600'
  }
])

onMounted(async () => {
  await botsStore.fetchBots()
  
  // Calculate stats
  stats.value.totalBots = botsStore.bots.length
  stats.value.activeBots = botsStore.bots.filter(bot => bot.is_active).length
  stats.value.totalApplications = botsStore.bots.reduce((sum, bot) => sum + (bot.stats?.total_applications || 0), 0)
  stats.value.pendingReviews = botsStore.bots.reduce((sum, bot) => sum + (bot.stats?.pending_applications || 0), 0)
})
</script>

<template>
  <Layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('dashboard.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ t('dashboard.subtitle') }}</p>
        </div>
        <RouterLink
          to="/bots/create"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ t('dashboard.createBot') }}
        </RouterLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
              <Bot class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('dashboard.stats.totalBots') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalBots }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center">
              <Activity class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('dashboard.stats.activeBots') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeBots }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900/50 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('dashboard.stats.totalApplications') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalApplications }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('dashboard.stats.pendingReviews') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.pendingReviews }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.quickActions.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RouterLink
            v-for="action in quickActions"
            :key="action.name"
            :to="action.href"
            :class="[
              'block p-4 rounded-lg text-white transition-colors',
              action.color
            ]"
          >
            <div class="flex items-center">
              <component :is="action.icon" class="w-6 h-6 mr-3" />
              <div>
                <h3 class="font-medium">{{ action.name }}</h3>
                <p class="text-sm opacity-90">{{ action.description }}</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Charts and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Applications Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.charts.applicationsWeek') }}</h2>
          <div class="space-y-4">
            <div
              v-for="day in chartData.applications"
              :key="day.day"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ day.day }}</span>
              <div class="flex items-center space-x-2 flex-1 ml-4">
                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(day.count / 24) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{{ day.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{{ t('dashboard.recentActivity.title') }}</h2>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <component :is="activity.icon" class="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 dark:text-white">{{ activity.message }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bots -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700" v-if="botsStore.bots.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('dashboard.recentBots.title') }}</h2>
          <RouterLink
            to="/bots"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
          >
            {{ t('dashboard.recentBots.viewAll') }}
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="bot in botsStore.bots.slice(0, 3)"
            :key="bot.id"
            class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ bot.name }}</h3>
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  bot.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                ]"
              >
                {{ bot.is_active ? t('common.active') : t('common.inactive') }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">{{ bot.description || 'No description' }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ bot.questions.length }} {{ t('common.questions') }}</span>
              <span>{{ bot.stats?.total_applications || 0 }} {{ t('common.applications') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>