export interface User {
  id: string
  username: string
  email?: string
  name: string
  company_name: string
  phone_number: string
  telegram_user_id?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  name: string
  company_name: string
  phone_number: string
  telegram_bot_token: string
  telegram_group_id: string
}