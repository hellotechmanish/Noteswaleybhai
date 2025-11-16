'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Download, X } from 'lucide-react'

interface PDFViewerProps {
  noteId: string
  title: string
  userEmail: string
  previewOnly?: boolean
  previewDuration?: number // in minutes
}

export function PDFViewer({
  noteId,
  title,
  userEmail,
  previewOnly = false,
  previewDuration = 10,
}: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(previewDuration * 60)

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (previewOnly) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Print (Ctrl+P)
      if (previewOnly && (e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
      }
      // Disable Save (Ctrl+S)
      if (previewOnly && (e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewOnly])

  useEffect(() => {
    if (!previewOnly || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    if (timeLeft === 60) {
      alert('Your preview will expire in 1 minute')
    }

    return () => clearInterval(timer)
  }, [timeLeft, previewOnly])

  useEffect(() => {
    if (timeLeft <= 0 && previewOnly) {
      window.location.href = '/dashboard'
    }
  }, [timeLeft, previewOnly])

  useEffect(() => {
    loadPDF()
  }, [noteId])

  async function loadPDF() {
    try {
      setLoading(true)
      const endpoint = previewOnly
        ? `/api/pdf/preview/${noteId}`
        : `/api/pdf/view/${noteId}`

      const response = await fetch(endpoint)

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Please purchase to view.')
        } else {
          setError('Failed to load PDF')
        }
        return
      }

      const blob = await response.blob()
      const pdfData = await blob.arrayBuffer()

      // Using PDF.js to render pages
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

        const pdf = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) })
        pdf.promise.then((pdfDoc: any) => {
          renderPages(pdfDoc)
        })
      }
      document.head.appendChild(script)
    } catch (err) {
      setError('Error loading PDF')
    }
  }

  async function renderPages(pdfDoc: any) {
    const renderPromises = []

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      renderPromises.push(
        pdfDoc.getPage(i).then((page: any) => {
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')!
          canvas.width = viewport.width
          canvas.height = viewport.height

          return page.render({ canvasContext: context, viewport }).promise.then(() => {
            const imageData = canvas.toDataURL('image/png')
            // Add watermark
            if (previewOnly) {
              return addWatermark(imageData, userEmail)
            }
            return imageData
          })
        })
      )
    }

    const renderedPages = await Promise.all(renderPromises)
    setPages(renderedPages)
    setCurrentPage(0)
    setLoading(false)
  }

  function addWatermark(imageData: string, text: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!

        ctx.drawImage(img, 0, 0)

        // Add transparent watermark
        ctx.save()
        ctx.globalAlpha = 0.15
        ctx.font = 'bold 48px Arial'
        ctx.rotate((-Math.PI / 180) * 45)
        ctx.textAlign = 'center'
        ctx.fillStyle = '#000000'

        for (let x = 0; x < canvas.width; x += 200) {
          for (let y = 0; y < canvas.height; y += 100) {
            ctx.fillText(text, x, y)
          }
        }

        ctx.restore()
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = imageData
    })
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading PDF...</div>
  }

  return (
    <div className="w-full bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {previewOnly && (
            <p className="text-sm text-red-300">
              Preview Mode - Time remaining: {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          )}
        </div>
        {previewOnly && (
          <Button
            variant="ghost"
            onClick={() => (window.location.href = '/dashboard')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* PDF Display */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        {pages.length > 0 && currentPage < pages.length && (
          <img
            src={pages[currentPage] || "/placeholder.svg"}
            alt={`Page ${currentPage + 1}`}
            className="max-w-full max-h-full"
            style={{ userSelect: 'none', pointerEvents: previewOnly ? 'none' : 'auto' }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Button
          variant="outline"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
        >
          Previous
        </Button>

        <span className="text-sm">
          Page {currentPage + 1} of {pages.length}
        </span>

        <Button
          variant="outline"
          disabled={currentPage === pages.length - 1}
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
        >
          Next
        </Button>

        {!previewOnly && (
          <Button
            onClick={() => {
              const link = document.createElement('a')
              link.href = `/api/pdf/download/${noteId}`
              link.download = `${title}.pdf`
              link.click()
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>
    </div>
  )
}
