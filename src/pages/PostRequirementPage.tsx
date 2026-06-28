import { useState, type FormEvent } from 'react'
import { useData } from '../context/DataWrapper'
import { AppLink } from '../components/AppLink'
import { serviceOptions } from '../constants/services'
import { postJson } from '../lib/api'
import { ROUTES, navigate } from '../lib/router'

export function PostRequirementPage() {
  const { currentUser, requirements, addRequirement, signOut } = useData()
  const [selectedService, setSelectedService] = useState('')
  const [requirementText, setRequirementText] = useState('')
  const [pincode, setPincode] = useState(currentUser?.pincode || '')
  const [searchMessage, setSearchMessage] = useState('')
  const [searchError, setSearchError] = useState('')
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false)
  const [queryMessage, setQueryMessage] = useState('')
  const [queryError, setQueryError] = useState('')

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedRequirement = requirementText.trim()
    const trimmedPincode = pincode.trim()

    if ((!selectedService && !trimmedRequirement) || !trimmedPincode) {
      setSearchError(
        'Please choose a service or enter your requirement, and fill the pincode.',
      )
      setSearchMessage('')
      return
    }

    try {
      const result = await addRequirement({
        service: selectedService,
        requirement: trimmedRequirement,
        pincode: trimmedPincode,
        userEmail: currentUser?.email,
      })

      setRequirementText('')
      setSelectedService('')
      setSearchError('')
      setSearchMessage(
        result.providers.length > 0
          ? `Requirement posted successfully. ${result.providers.length} provider(s) found nearby.`
          : 'Requirement posted successfully. No nearby providers found yet.',
      )
      navigate(ROUTES.providers)
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : 'Unable to post requirement right now.',
      )
      setSearchMessage('')
    }
  }

  const handleQuerySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      await postJson('/api/raise-query', {
        name: String(formData.get('name') || ''),
        phone: String(formData.get('phone') || ''),
        problemDescription: String(formData.get('problemDescription') || ''),
      })

      setQueryError('')
      setQueryMessage('Your query has been noted. Our team will contact you soon.')
      event.currentTarget.reset()
    } catch (error) {
      setQueryMessage('')
      setQueryError(
        error instanceof Error ? error.message : 'Unable to submit query right now.',
      )
    }
  }

  return (
    <main className="post-page">
      <section className="post-shell">
        <div className="post-topbar">
          <AppLink className="post-brand" to={ROUTES.home}>
            LOD
          </AppLink>

          <div className="post-topbar-actions">
            <button
              className="post-pill-button"
              onClick={() => navigate(ROUTES.home)}
              type="button"
            >
              Home
            </button>
            <button
              className="post-pill-button"
              onClick={() => {
                signOut()
                navigate(ROUTES.signin)
              }}
              type="button"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="post-intro">
          <div>
            <h1 className="post-title">Choose service required</h1>
          </div>
          <div className="post-user-badge">
            <strong>{currentUser?.fullName || currentUser?.email || 'LOD User'}</strong>
            <span>Logged in and ready to post requirement</span>
          </div>
        </div>

        <form className="post-board" onSubmit={handleSearch}>
          <section className="post-services-panel">
            <div className="post-services-grid">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  className={`post-service-chip ${selectedService === service ? 'is-selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                  type="button"
                >
                  {service}
                </button>
              ))}
            </div>
          </section>

         

          <div className="post-actions-row">
            <label className="post-field post-pincode-field">
              <span>Enter the pincode</span>
              <input
                className="post-input"
                type="text"
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                placeholder="Enter the pincode"
              />
            </label>

            <div className="post-button-stack">
              <button className="post-action-button" type="submit">
                Search
              </button>
              <button
                className="post-action-button post-action-button-secondary"
                onClick={() => {
                  setIsQueryModalOpen(true)
                  setQueryMessage('')
                }}
                type="button"
              >
                Ask Query
              </button>
            </div>
          </div>

          {searchError ? <p className="post-message post-message-error">{searchError}</p> : null}
          {searchMessage ? <p className="post-message post-message-success">{searchMessage}</p> : null}
        </form>

        <section className="post-history">
          <div className="post-history-head">
            <h2>Recent Service Searched</h2>
            <span>{requirements.length} total</span>
          </div>

          {requirements.length === 0 ? (
            <p className="post-empty-state">No requirements posted yet.</p>
          ) : (
            <div className="post-history-grid">
              {requirements.map((requirement) => (
                <article key={requirement.id} className="post-history-card">
                  <div className="post-history-card-head">
                    <strong>{requirement.title}</strong>
                    <span>{new Date(requirement.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{requirement.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      {isQueryModalOpen ? (
        <div
          className="post-modal-backdrop"
          onClick={() => setIsQueryModalOpen(false)}
          role="presentation"
        >
          <section
            aria-modal="true"
            className="post-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="post-modal-head">
              <div>
                <p className="post-eyebrow">Ask Query</p>
                <h2>Tell us your problem</h2>
              </div>
              <button
                aria-label="Close query form"
                className="post-modal-close"
                onClick={() => setIsQueryModalOpen(false)}
                type="button"
              >
                x
              </button>
            </div>

            <form className="post-modal-form" onSubmit={handleQuerySubmit}>
              <label className="post-field">
                <span>Name</span>
                <input
                  className="post-input"
                  defaultValue={currentUser?.fullName || ''}
                  name="name"
                  required
                  type="text"
                  placeholder="Enter your name"
                />
              </label>

              <label className="post-field">
                <span>Phone Number</span>
                <input
                  className="post-input"
                  defaultValue={currentUser?.mobile || ''}
                  name="phone"
                  required
                  type="tel"
                  placeholder="Enter your phone number"
                />
              </label>

              <label className="post-field">
                <span>Problem Description</span>
                <textarea
                  className="post-textarea post-modal-textarea"
                  name="problemDescription"
                  required
                  placeholder="Briefly describe your problem"
                />
              </label>

              {queryMessage ? (
                <p className="post-message post-message-success">{queryMessage}</p>
              ) : null}
              {queryError ? <p className="post-message post-message-error">{queryError}</p> : null}

              <button className="post-action-button post-modal-submit" type="submit">
                Submit Query
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  )
}
