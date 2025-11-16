'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Lock, Download, Eye, AlertCircle } from 'lucide-react'
import type { University, Course, Subject, Note } from '@/lib/types'

export function NotesBrowser() {
  const [universities, setUniversities] = useState<University[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  
  const [selectedUniversity, setSelectedUniversity] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userPurchases, setUserPurchases] = useState<string[]>([])

  useEffect(() => {
    fetchUniversities()
    fetchUserPurchases()
  }, [])

  useEffect(() => {
    if (selectedUniversity) {
      fetchCourses(selectedUniversity)
    }
  }, [selectedUniversity])

  useEffect(() => {
    if (selectedCourse) {
      fetchSubjects(selectedCourse)
    }
  }, [selectedCourse])

  useEffect(() => {
    if (selectedSubject) {
      fetchNotes(selectedSubject)
    }
  }, [selectedSubject])

  async function fetchUniversities() {
    try {
      const response = await fetch('/api/universities')
      const data = await response.json()
      setUniversities(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load universities')
      setLoading(false)
    }
  }

  async function fetchCourses(universityId: string) {
    try {
      const response = await fetch(`/api/courses?universityId=${universityId}`)
      const data = await response.json()
      setCourses(data)
      setSelectedCourse('')
      setSubjects([])
      setNotes([])
    } catch (err) {
      setError('Failed to load courses')
    }
  }

  async function fetchSubjects(courseId: string) {
    try {
      const response = await fetch(`/api/subjects?courseId=${courseId}`)
      const data = await response.json()
      setSubjects(data)
      setSelectedSubject('')
      setNotes([])
    } catch (err) {
      setError('Failed to load subjects')
    }
  }

  async function fetchNotes(subjectId: string) {
    try {
      setLoading(true)
      const response = await fetch(`/api/notes?subjectId=${subjectId}`)
      const data = await response.json()
      setNotes(data)
    } catch (err) {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserPurchases() {
    try {
      const response = await fetch('/api/student/purchases')
      if (response.ok) {
        const data = await response.json()
        setUserPurchases(data.purchases || [])
      }
    } catch (err) {
      console.error('Failed to load purchases')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Notes</CardTitle>
          <CardDescription>Select university, course, and subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">University</label>
              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={!selectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} (Sem {subject.semester})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && selectedSubject && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 mb-4 w-3/4" />
                <Skeleton className="h-4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && notes.length === 0 && selectedSubject && (
        <Card>
          <CardContent className="pt-12 text-center pb-12">
            <p className="text-muted-foreground">No notes available for this subject yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {notes.map((note) => {
          const hasPurchased = userPurchases.includes(note.id)
          return (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>{note.description}</CardDescription>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                    {note.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/preview/${note.id}`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview (Free 10 min)
                    </Button>

                    {!hasPurchased && (
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `/payment/${note.id}?type=view`}
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Unlock ₹5
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.location.href = `/payment/${note.id}?type=download`}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download ₹25
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
