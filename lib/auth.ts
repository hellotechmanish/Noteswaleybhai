import bcrypt from 'bcryptjs'
import { createClient } from './supabase'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getUserByEmail(email: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

export async function createUser(name: string, email: string, hashedPassword: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email,
        password_hash: hashedPassword,
        is_verified: false,
        role: 'student',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}
