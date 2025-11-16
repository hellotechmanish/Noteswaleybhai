'use client'

import { useSearchParams } from 'next/navigation'
import { PaymentModal } from '@/components/student/payment-modal'

interface PageProps {
  params: { id: string }
}

export default function PaymentPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as 'view' | 'download') || 'view'
  const title = searchParams.get('title') || 'Notes'

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <PaymentModal noteId={params.id} type={type} title={title} />
    </main>
  )
}
