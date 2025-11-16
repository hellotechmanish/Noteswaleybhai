import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import dbConnect from '@/lib/mongodb'
import Note from '@/lib/models/Note'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('authToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const subjectId = formData.get('subjectId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file || !subjectId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB.' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files allowed' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('notes-pdfs')
      .upload(`${payload.userId}/${fileName}`, file)

    if (uploadError) {
      throw uploadError
    }

    await dbConnect()
    const note = await Note.create({
      userId: payload.userId,
      subjectId,
      title,
      description,
      pdfPath: `${payload.userId}/${fileName}`,
      fileSize: file.size,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: 'Notes uploaded successfully. Awaiting admin approval.',
        note,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload notes' },
      { status: 500 }
    )
  }
}
