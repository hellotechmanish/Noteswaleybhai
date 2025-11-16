'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface PaymentModalProps {
  noteId: string
  type: 'view' | 'download'
  title: string
}

export function PaymentModal({ noteId, type, title }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [razorpayKeyId, setRazorpayKeyId] = useState('')

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await fetch('/api/config/razorpay-key')
        const data = await response.json()
        setRazorpayKeyId(data.keyId)
      } catch (err) {
        setError('Failed to load payment configuration')
      }
    }
    fetchRazorpayKey()
  }, [])

  const amount = type === 'view' ? 500 : 2500 // in paise
  const displayAmount = type === 'view' ? '₹5' : '₹25'
  const validity = type === 'view' ? '1 Year' : 'One-time'

  async function handlePayment() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, type }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to initiate payment')
        setLoading(false)
        return
      }

      // Load Razorpay script and open payment modal
      loadRazorpayAndPay(data.orderId, data.amount, data.receipt)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  function loadRazorpayAndPay(orderId: string, amount: number, receipt: string) {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: 'INR',
        order_id: orderId,
        handler: async (response: any) => {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })

          if (verifyResponse.ok) {
            setSuccess(true)
            setTimeout(() => {
              if (type === 'view') {
                window.location.href = `/preview/${noteId}`
              } else {
                window.location.href = `/download/${noteId}`
              }
            }, 2000)
          } else {
            setError('Payment verification failed')
            setLoading(false)
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#2563eb',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
      setLoading(false)
    }
    document.body.appendChild(script)
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Unlock {title}</CardTitle>
        <CardDescription>
          {type === 'view' ? 'Unlock for 1 year access' : 'Download PDF permanently'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                Payment successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{displayAmount}</div>
            <p className="text-sm text-muted-foreground">
              Valid for: <span className="font-medium">{validity}</span>
            </p>
          </div>

          <div className="border rounded p-4">
            <h4 className="font-medium mb-2">What's included:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {type === 'view' ? (
                <>
                  <li>✓ Full year access</li>
                  <li>✓ View anytime</li>
                  <li>✓ Watermarked PDFs</li>
                </>
              ) : (
                <>
                  <li>✓ Download PDF</li>
                  <li>✓ Keep forever</li>
                  <li>✓ No watermark</li>
                </>
              )}
            </ul>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !razorpayKeyId}
            size="lg"
            className="w-full"
          >
            {loading ? 'Processing...' : `Pay ${displayAmount}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment via Razorpay
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
