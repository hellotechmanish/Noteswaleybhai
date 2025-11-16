import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subject from '@/lib/models/Subject'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const subjects = await Subject.find({ courseId }).sort({ semester: 1, name: 1 })
    return NextResponse.json(subjects || [])
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}
