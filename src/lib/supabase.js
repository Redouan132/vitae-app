import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://tdxperfiejlztjknvmch.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeHBlcmZpZWpsenRqa252bWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTY3MjEsImV4cCI6MjA5NDA5MjcyMX0.B78h7IZsKcIZv7TWLzQTJVN3sJINUzbmZFCkSDapGAE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)