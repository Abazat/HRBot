import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Bot, BotForm, Question } from '../types/bot'

export const useBotsStore = defineStore('bots', () => {
  const bots = ref<Bot[]>([])
  const currentBot = ref<Bot | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Demo bots data
  const demoBots: Bot[] = [
    {
      id: 'bot1',
      name: 'Frontend Developer Bot',
      description: 'Бот для поиска frontend разработчиков',
      telegram_token: '123456789:ABCdefGHIjklMNOpqrSTUvwxyz',
      telegram_group_id: '-1001234567890',
      welcome_message: 'Добро пожаловать! 👋\n\nМы ищем талантливого Frontend разработчика для нашей команды. Пожалуйста, ответьте на несколько вопросов.',
      welcome_media: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
      welcome_media_type: 'image',
      closing_message: '✅ Спасибо за вашу заявку!\n\nМы рассмотрим ваше резюме и свяжемся с вами в ближайшее время.',
      is_active: true,
      questions: [
        {
          id: 'q1',
          text: 'Как вас зовут? Напишите ваше полное имя.',
          type: 'text',
          required: true,
          order: 1
        },
        {
          id: 'q2',
          text: 'Сколько лет у вас опыта в frontend разработке?',
          type: 'button_choice',
          required: true,
          options: ['Менее 1 года', '1-2 года', '3-5 лет', 'Более 5 лет'],
          order: 2
        },
        {
          id: 'q3',
          text: 'Отправьте ваше фото для резюме',
          type: 'image',
          required: true,
          order: 3,
          validation_message: 'Пожалуйста, отправьте изображение'
        },
        {
          id: 'q4',
          text: 'Расскажите о себе голосовым сообщением (1-2 минуты)',
          type: 'voice',
          required: true,
          order: 4,
          validation_message: 'Пожалуйста, отправьте голосовое сообщение'
        }
      ],
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
      stats: {
        total_applications: 45,
        completed_applications: 38,
        pending_applications: 12,
        conversion_rate: 84.4
      }
    },
    {
      id: 'bot2',
      name: 'Backend Developer Bot',
      description: 'Бот для поиска backend разработчиков',
      telegram_token: '987654321:ZYXwvuTSRqpONMlkjIHgfeDCba',
      telegram_group_id: '-1001234567891',
      welcome_message: 'Привет! 🚀\n\nМы ищем опытного Backend разработчика. Готовы ответить на несколько вопросов?',
      closing_message: '🎉 Отлично! Ваша заявка принята.\n\nНаш HR-менеджер свяжется с вами в течение 2-3 рабочих дней.',
      is_active: true,
      questions: [
        {
          id: 'q1',
          text: 'Представьтесь, пожалуйста',
          type: 'text',
          required: true,
          order: 1
        },
        {
          id: 'q2',
          text: 'Какие технологии вы используете?',
          type: 'button_choice',
          required: true,
          options: ['Python/Django', 'Node.js', 'Java/Spring', 'PHP/Laravel', 'Go', 'Другое'],
          order: 2
        },
        {
          id: 'q3',
          text: 'Запишите короткое видео о своем опыте (до 1 минуты)',
          type: 'video',
          required: false,
          order: 3,
          validation_message: 'Пожалуйста, отправьте видео'
        }
      ],
      created_at: '2024-01-12T15:20:00Z',
      updated_at: '2024-01-16T09:15:00Z',
      stats: {
        total_applications: 28,
        completed_applications: 22,
        pending_applications: 8,
        conversion_rate: 78.6
      }
    },
    {
      id: 'bot3',
      name: 'Marketing Manager Bot',
      description: 'Бот для поиска маркетинг менеджеров',
      telegram_token: '456789123:QWErtyUIOPasDFghjKLzxcVBnm',
      telegram_group_id: '-1001234567892',
      welcome_message: 'Добро пожаловать в нашу команду! 📈\n\nМы ищем креативного маркетинг менеджера.',
      closing_message: '✨ Спасибо за интерес к нашей компании!\n\nМы обязательно рассмотрим вашу кандидатуру.',
      is_active: false,
      questions: [
        {
          id: 'q1',
          text: 'Как вас зовут?',
          type: 'text',
          required: true,
          order: 1
        },
        {
          id: 'q2',
          text: 'Опыт работы в маркетинге',
          type: 'button_choice',
          required: true,
          options: ['Нет опыта', '1-3 года', '3-5 лет', 'Более 5 лет'],
          order: 2
        }
      ],
      created_at: '2024-01-08T12:00:00Z',
      updated_at: '2024-01-14T16:45:00Z',
      stats: {
        total_applications: 15,
        completed_applications: 12,
        pending_applications: 5,
        conversion_rate: 80.0
      }
    }
  ]

  const fetchBots = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      bots.value = [...demoBots]
    } catch (err: any) {
      error.value = 'Ошибка загрузки ботов'
    } finally {
      loading.value = false
    }
  }

  const fetchBot = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      const bot = demoBots.find(b => b.id === id)
      if (bot) {
        currentBot.value = { ...bot }
        return bot
      } else {
        error.value = 'Бот не найден'
        return null
      }
    } catch (err: any) {
      error.value = 'Ошибка загрузки бота'
      return null
    } finally {
      loading.value = false
    }
  }

  const createBot = async (botData: BotForm) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBot: Bot = {
        id: 'bot' + (Date.now()),
        ...botData,
        is_active: false,
        questions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stats: {
          total_applications: 0,
          completed_applications: 0,
          pending_applications: 0,
          conversion_rate: 0
        }
      }
      
      bots.value.push(newBot)
      demoBots.push(newBot)
      return newBot
    } catch (err: any) {
      error.value = 'Ошибка создания бота'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateBot = async (id: string, botData: Partial<BotForm>) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const index = bots.value.findIndex(bot => bot.id === id)
      if (index !== -1) {
        bots.value[index] = { ...bots.value[index], ...botData, updated_at: new Date().toISOString() }
        
        // Update in demo data
        const demoIndex = demoBots.findIndex(bot => bot.id === id)
        if (demoIndex !== -1) {
          demoBots[demoIndex] = { ...demoBots[demoIndex], ...botData, updated_at: new Date().toISOString() }
        }
        
        if (currentBot.value?.id === id) {
          currentBot.value = bots.value[index]
        }
        return bots.value[index]
      }
      return null
    } catch (err: any) {
      error.value = 'Ошибка обновления бота'
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteBot = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600))
      
      bots.value = bots.value.filter(bot => bot.id !== id)
      
      // Remove from demo data
      const demoIndex = demoBots.findIndex(bot => bot.id === id)
      if (demoIndex !== -1) {
        demoBots.splice(demoIndex, 1)
      }
      
      if (currentBot.value?.id === id) {
        currentBot.value = null
      }
      return true
    } catch (err: any) {
      error.value = 'Ошибка удаления бота'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateBotQuestions = async (botId: string, questions: Question[]) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700))
      
      const bot = bots.value.find(b => b.id === botId)
      if (bot) {
        bot.questions = [...questions]
        bot.updated_at = new Date().toISOString()
        
        // Update in demo data
        const demoBot = demoBots.find(b => b.id === botId)
        if (demoBot) {
          demoBot.questions = [...questions]
          demoBot.updated_at = new Date().toISOString()
        }
        
        if (currentBot.value?.id === botId) {
          currentBot.value.questions = [...questions]
        }
      }
      return true
    } catch (err: any) {
      error.value = 'Ошибка обновления вопросов'
      return false
    } finally {
      loading.value = false
    }
  }

  const toggleBotStatus = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const bot = bots.value.find(b => b.id === id)
      if (bot) {
        bot.is_active = !bot.is_active
        bot.updated_at = new Date().toISOString()
        
        // Update in demo data
        const demoBot = demoBots.find(b => b.id === id)
        if (demoBot) {
          demoBot.is_active = bot.is_active
          demoBot.updated_at = bot.updated_at
        }
        
        if (currentBot.value?.id === id) {
          currentBot.value.is_active = bot.is_active
        }
        
        return bot
      }
      return null
    } catch (err: any) {
      error.value = 'Ошибка изменения статуса бота'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    bots,
    currentBot,
    loading,
    error,
    fetchBots,
    fetchBot,
    createBot,
    updateBot,
    deleteBot,
    updateBotQuestions,
    toggleBotStatus
  }
})