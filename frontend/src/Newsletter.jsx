import { useState } from 'react'

export default function Newsletter() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function subscribe(event) {
    event.preventDefault()
    const form = event.currentTarget
    const email = new FormData(form).get('email').trim()

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      setMessage(result.message || 'Unable to complete signup.')

      if (response.ok) {
        form.reset()
      }
    } catch {
      setMessage('Signup is unavailable right now. Please try again shortly.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <h3>Stay in Touch</h3>
      <p>Subscribe for restaurant news, seasonal menus, and special events.</p>

      <form className="booking-form" onSubmit={subscribe}>
        <label>
          Email address
          <input
            type="email"
            name="email"
            maxLength="254"
            autoComplete="email"
            required
          />
        </label>

        <button type="submit" disabled={busy}>
          {busy ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>

        <p role="status" aria-live="polite">{message}</p>
      </form>
    </section>
  )
}