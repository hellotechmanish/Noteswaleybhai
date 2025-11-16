import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import dbConnect from '@/lib/mongodb'
import Note from '@/lib/models/Note'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('authToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { reason } = await request.json()

    await dbConnect()
    const note = await Note.findByIdAndUpdate(
      params.id,
      {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Note rejected', note })
  } catch (error) {
    console.error('Error rejecting note:', error)
    return NextResponse.json(
      { error: 'Failed to reject note' },
      { status: 500 }
    )
  }
}
