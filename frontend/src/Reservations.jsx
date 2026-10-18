import { useState } from 'react'

export default function Reservations() {
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  // Offer hourly bookings, with the last slot one hour before closing.
  const closingHour =
    date && new Date(`${date}T12:00:00`).getDay() === 0 ? 21 : 23

  const hours = Array.from(
    { length: closingHour - 17 },
    (_, index) => 17 + index
  )

  async function submitReservation(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fields.get('customer_name').trim(),
          email: fields.get('email').trim(),
          phone_number: fields.get('phone_number').trim(),
          number_of_guests: Number(fields.get('number_of_guests')),
          time_slot: `${date}T${fields.get('time')}:00`,
        }),
      })

      const result = await response.json()
      setMessage(result.message || 'Unable to complete the reservation.')

      if (response.ok) {
        form.reset()
        setDate('')
      }
    } catch {
      setMessage(
        'Unable to reach the reservation service. Please try again shortly.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <p>
        Choose your dining date and time. All times are local to
        our Washington, DC restaurant.
      </p>

      <form className="booking-form" onSubmit={submitReservation}>
        <label>
          Date
          <input
            type="date"
            name="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <label>
          Time
          <select name="time" key={date} required>
            <option value="">Select a time</option>
            {hours.map((hour) => (
              <option key={hour} value={`${hour}:00`}>
                {hour - 12}:00 PM
              </option>
            ))}
          </select>
        </label>

        <label>
          Number of guests
          <input
            type="number"
            name="number_of_guests"
            min="1"
            step="1"
            required
          />
        </label>

        <label>
          Your name
          <input
            type="text"
            name="customer_name"
            maxLength="100"
            autoComplete="name"
            required
          />
        </label>

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

        <label>
          Phone number (optional)
          <input
            type="tel"
            name="phone_number"
            maxLength="30"
            autoComplete="tel"
          />
        </label>

        <button type="submit" disabled={busy}>
          {busy ? 'Booking...' : 'Reserve a Table'}
        </button>

        <p role="status" aria-live="polite">{message}</p>
      </form>
    </section>
  )
}