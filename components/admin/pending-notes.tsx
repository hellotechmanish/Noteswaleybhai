'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import type { Note } from '@/lib/types'

export function PendingNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [earnings, setEarnings] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchPendingNotes()
  }, [])

  async function fetchPendingNotes() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/notes/pending')
      const data = await response.json()
      setNotes(data)
    } catch (err) {
      setError('Failed to fetch pending notes')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(noteId: string) {
    const earning = earnings[noteId] || '100'

    try {
      const response = await fetch(`/api/admin/notes/${noteId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ earnings: parseInt(earning) }),
      })

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== noteId))
        delete earnings[noteId]
      }
    } catch (err) {
      alert('Failed to approve note')
    }
  }

  async function handleReject(noteId: string) {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      const response = await fetch(`/api/admin/notes/${noteId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== noteId))
      }
    } catch (err) {
      alert('Failed to reject note')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Notes Verification</CardTitle>
        <CardDescription>{notes.length} notes awaiting review</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {notes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pending notes</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-bold">{note.title}</h4>
                  <p className="text-sm text-muted-foreground">{note.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Size: {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</div>
                  <div>Status: <span className="font-medium">{note.status}</span></div>
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Earnings (if approved)</label>
                    <Input
                      type="number"
                      value={earnings[note.id] || '100'}
                      onChange={(e) =>
                        setEarnings({
                          ...earnings,
                          [note.id]: e.target.value,
                        })
                      }
                      min="0"
                    />
                  </div>
                  <Button
                    onClick={() => handleApprove(note.id)}
                    variant="default"
                    size="sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(note.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
