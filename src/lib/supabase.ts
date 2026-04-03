import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dxgftaonhttxephzullk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_phO4vqwzS8dk-JyhM7Oh1w_FFqrea_S'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type Profile = {
  id: string
  name: string
  age: number
  bio: string | null
  intention: 'relationship' | 'dating' | 'connection' | 'friendship'
  gender: string | null
  looking_for: string | null
  location: string | null
  avatar_url: string | null
  created_at: string
}

export type Match = {
  id: string
  user_a: string
  user_b: string
  created_at: string
  other_profile?: Profile
}

export type Message = {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
}
