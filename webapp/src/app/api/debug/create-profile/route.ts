/**
 * Debug API: Create User Profile
 *
 * This endpoint creates a user profile if it's missing
 * Should only be used in development
 */

import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

async function handleRequest() {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Check if profile exists
    const serviceSupabase = createServiceClient()
    const { data: existingProfile } = await serviceSupabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({
        message: 'Profile already exists',
        profile: existingProfile,
      })
    }

    // Create profile
    const { data: newProfile, error: insertError } = await serviceSupabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        subscription_tier: 'free',
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({
      message: 'Profile created successfully',
      profile: newProfile,
    })
  } catch (error) {
    console.error('Create profile error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: `Erro ao criar perfil: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  return handleRequest()
}

export async function POST() {
  return handleRequest()
}
