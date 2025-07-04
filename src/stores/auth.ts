import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Demo users for testing
  const demoUsers = [
    {
      id: '1',
      username: 'demo',
      email: 'demo@example.com',
      name: 'Демо Пользователь',
      company_name: 'IT Solutions LLC',
      phone_number: '+998901234567',
      telegram_user_id: '123456789',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      username: 'admin',
      email: 'admin@hrbot.com',
      name: 'Администратор',
      company_name: 'HR Bot Constructor',
      phone_number: '+998901234568',
      telegram_user_id: '987654321',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      username: 'recruiter',
      email: 'recruiter@company.com',
      name: 'Анна Рекрутер',
      company_name: 'Tech Startup Inc',
      phone_number: '+998901234569',
      telegram_user_id: '456789123',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find demo user
      const foundUser = demoUsers.find(u => 
        u.username === credentials.username && 
        (credentials.password === 'demo' || credentials.password === 'password')
      )

      if (foundUser) {
        user.value = foundUser
        localStorage.setItem('demo_token', 'demo_jwt_token_' + foundUser.id)
        localStorage.setItem('demo_user', JSON.stringify(foundUser))
        return true
      } else {
        error.value = 'Неверное имя пользователя или пароль'
        return false
      }
    } catch (err: any) {
      error.value = 'Ошибка входа в систему'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('demo_token')
    localStorage.removeItem('demo_user')
  }

  const initializeAuth = () => {
    const token = localStorage.getItem('demo_token')
    const userData = localStorage.getItem('demo_user')

    if (token && userData) {
      try {
        user.value = JSON.parse(userData)
      } catch {
        logout()
      }
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (user.value) {
        user.value = { ...user.value, ...profileData }
        localStorage.setItem('demo_user', JSON.stringify(user.value))
      }
      return true
    } catch (err: any) {
      error.value = 'Ошибка обновления профиля'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    initializeAuth,
    updateProfile
  }
})