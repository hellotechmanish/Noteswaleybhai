'use client'

import { useEffect, useState } from 'react'
import { PDFViewer } from '@/components/pdf/pdf-viewer'

interface PageProps {
  params: { id: string }
}

export default function DownloadPage({ params }: PageProps) {
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        setUserEmail(data.email || 'student@example.com')
      } catch (err) {
        setUserEmail('student@example.com')
      }
    }
    fetchUser()
  }, [])

  return (
    <PDFViewer
      noteId={params.id}
      title="Full Access"
      userEmail={userEmail}
      previewOnly={false}
    />
  )
}
