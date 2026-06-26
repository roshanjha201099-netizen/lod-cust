import { useState, type FormEvent } from 'react'
import { postJson } from '../lib/api'

export function ProviderJoinSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      await postJson('/api/join-service', {
        name: String(formData.get('name') || ''),
        phone: String(formData.get('phone') || ''),
      })

      setSubmitError('')
      setIsSubmitted(true)
      event.currentTarget.reset()
    } catch (error) {
      setIsSubmitted(false)
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to join as provider right now.',
      )
    }
  }

  return (
    <section className="provider-section" id="providers">
      <div className="provider-copy">
        <p className="section-tag">For Service Providers</p>
        <h2>Get More Customers With LOD</h2>
        <p>
          Join for free and let customers find you. Share your name and number,
          and we will handle the rest from the backend.
        </p>
      </div>

      <form className="provider-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Name</span>
          <input required name="name" type="text" placeholder="Enter your name" />
        </label>

        <label className="form-field">
          <span>Phone Number</span>
          <input
            required
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
          />
        </label>

        {isSubmitted ? (
          <p className="form-message success-message">
            Your provider request has been noted. We will contact you soon.
          </p>
        ) : null}
        {submitError ? <p className="form-message error-message">{submitError}</p> : null}

        <button className="button button-primary provider-submit" type="submit">
          Join as Provider
        </button>
      </form>
    </section>
  )
}
