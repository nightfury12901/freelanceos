'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Loads the Razorpay SDK script dynamically.
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    setIsLoading(true)
    try {
      const res = await loadRazorpayScript()
      if (!res) {
        alert('Razorpay SDK failed to load. Check your connection.')
        setIsLoading(false)
        return
      }

      // Create an order via backend
      const orderRes = await fetch('/api/checkout/razorpay', { method: 'POST' })
      if (!orderRes.ok) throw new Error('Order creation failed')

      const orderData = await orderRes.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Freelancer Compliance OS',
        description: 'Pro Plan Subscription',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Send verification to backend
          const verifyRes = await fetch('/api/checkout/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          
          if (verifyRes.ok) {
            alert('Payment successful! Welcome to Pro.')
            router.refresh()
          } else {
            alert('Payment verification failed.')
          }
        },
        theme: {
          color: '#6366f1', // Indigo 500
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`)
      })
      rzp.open()
    } catch (err) {
      console.error('[CheckoutButton]', err)
      alert('Could not initiate checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        'Upgrade to Pro'
      )}
    </button>
  )
}
