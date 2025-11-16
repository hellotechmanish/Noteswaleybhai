'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, CheckCircle2, UploadIcon } from 'lucide-react'
import type { University, Course, Subject } from '@/lib/types'

export function UploadForm() {
  const [universities, setUniversities] = useState<University[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  const [selectedUni, setSelectedUni] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    if (selectedUni) {
      fetchCourses(selectedUni)
    }
  }, [selectedUni])

  useEffect(() => {
    if (selectedCourse) {
      fetchSubjects(selectedCourse)
    }
  }, [selectedCourse])

  async function fetchUniversities() {
    try {
      const response = await fetch('/api/universities')
      const data = await response.json()
      setUniversities(data)
    } catch (err) {
      setError('Failed to load universities')
    }
  }

  async function fetchCourses(universityId: string) {
    try {
      const response = await fetch(`/api/courses?universityId=${universityId}`)
      const data = await response.json()
      setCourses(data)
      setSelectedCourse('')
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
    } catch (err) {
      setError('Failed to load subjects')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!selectedSubject || !title || !file) {
      setError('All fields are required')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('subjectId', selectedSubject)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('file', file)

      const response = await fetch('/api/student/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      setSuccess(true)
      // Reset form
      setTitle('')
      setDescription('')
      setFile(null)
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Upload Your Notes</CardTitle>
        <CardDescription>
          Share your notes with other students and earn money. Max 5MB PDF file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Notes uploaded successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">University</label>
            <Select value={selectedUni} onValueChange={setSelectedUni} disabled={loading}>
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
            <label className="block text-sm font-medium mb-1">Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={!selectedUni || loading}>
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
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedCourse || loading}>
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

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 3 - Calculus Notes"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your notes..."
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PDF File (Max 5MB)</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF (max 5MB)</p>
                {file && (
                  <p className="text-sm text-green-600 mt-2 font-medium">{file.name}</p>
                )}
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Notes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
