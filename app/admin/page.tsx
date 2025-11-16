import { AdminHeader } from '@/components/admin/admin-header'
import { PendingNotes } from '@/components/admin/pending-notes'
import { UsersManagement } from '@/components/admin/users-management'
import { PaymentsTracking } from '@/components/admin/payments-tracking'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <PendingNotes />
          <UsersManagement />
          <PaymentsTracking />
        </div>
      </div>
    </main>
  )
}
