'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Upload, BarChart3 } from 'lucide-react'

interface DashboardHeaderProps {
  userName?: string
}

export function DashboardHeader({ userName = 'Student' }: DashboardHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
          <p className="text-sm text-muted-foreground">Browse and access quality study notes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/student/earnings">
              <BarChart3 className="w-4 h-4 mr-2" />
              My Earnings
            </a>
          </Button>
          <Button asChild>
            <a href="/student/upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Notes
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
