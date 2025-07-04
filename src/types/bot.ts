export interface Bot {
  id: string
  name: string
  description?: string
  telegram_token: string
  telegram_group_id: string
  welcome_message: string
  welcome_media?: string
  welcome_media_type?: 'image' | 'video' | 'audio'
  closing_message: string
  is_active: boolean
  questions: Question[]
  created_at: string
  updated_at: string
  stats?: BotStats
}

export interface BotForm {
  name: string
  description?: string
  telegram_token: string
  telegram_group_id: string
  welcome_message: string
  welcome_media?: string
  welcome_media_type?: 'image' | 'video' | 'audio'
  closing_message: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[]
  order: number
  validation_message?: string
}

export type QuestionType = 'text' | 'image' | 'voice' | 'video' | 'video_note' | 'button_choice'

export interface BotStats {
  total_applications: number
  completed_applications: number
  pending_applications: number
  conversion_rate: number
}

export interface Resume {
  id: string
  bot_id: string
  telegram_user_id: string
  user_data: any
  answers: Answer[]
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Answer {
  question_id: string
  question_text: string
  answer_type: QuestionType
  answer_value: string
  media_url?: string
}