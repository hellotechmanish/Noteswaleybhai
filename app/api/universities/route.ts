import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import University from '@/lib/models/University'

export async function GET() {
  try {
    await dbConnect()
    const universities = await University.find().sort({ name: 1 })
    return NextResponse.json(universities || [])
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}
