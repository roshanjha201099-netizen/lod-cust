import { useState } from 'react'
import { useData } from '../context/DataWrapper'
import { ROUTES, navigate } from '../lib/router'
import { AppLink } from '../components/AppLink'

export function ProvidersPage() {
  const { matchedProviders, unlockedProviderIds, unlockProviderPhone, wallet } = useData()
  const [unlockingProviderId, setUnlockingProviderId] = useState<string | null>(null)
  const [unlockError, setUnlockError] = useState('')

  const handleUnlock = async (providerId: string) => {
    const provider = matchedProviders.find((item) => item.id === providerId)

    if (!provider) {
      return
    }

    try {
      setUnlockingProviderId(providerId)
      setUnlockError('')
      await unlockProviderPhone({ provider })
    } catch (error) {
      setUnlockError(
        error instanceof Error ? error.message : 'Unable to unlock phone number right now.',
      )
    } finally {
      setUnlockingProviderId(null)
    }
  }

  return (
    <main className="auth-page">
      <section className="post-shell providers-page-shell">
        <div className="post-topbar">
          <AppLink className="post-brand" to={ROUTES.home}>
            LOD
          </AppLink>

          <div className="post-topbar-actions">
            <button
              className="post-pill-button"
              onClick={() => navigate(ROUTES.postRequirement)}
              type="button"
            >
              Back to Search
            </button>
            <button
              className="post-action-button post-action-button-secondary"
              onClick={() => navigate(ROUTES.home)}
              type="button"
            >
              Home
            </button>
          </div>
        </div>

        <div className="post-intro">
          <div>
            <p className="section-tag">Matched Providers</p>
            <h1 className="post-title">Nearby service providers</h1>
          </div>
          <div className="post-user-badge">
            <strong>{wallet.balance} credits left</strong>
            <span>{matchedProviders.length} provider(s) found for your request</span>
          </div>
        </div>

        {unlockError ? <p className="post-message post-message-error">{unlockError}</p> : null}

        {matchedProviders.length === 0 ? (
          <section className="post-history">
            <p className="post-empty-state">
              No providers found yet. Try another pincode or service requirement.
            </p>
          </section>
        ) : (
          <section className="providers-results-grid">
            {matchedProviders.map((provider) => (
              <article key={provider.id} className="provider-result-card">
                <div className="provider-result-image-wrap">
                  <ProviderAvatarIcon />
                </div>
                <div className="provider-result-body">
                  <div className="post-history-card-head">
                    <strong>{provider.name}</strong>
                    <span>{provider.rating.toFixed(1)} rating</span>
                  </div>
                  <p>{provider.service}</p>
                  <p>Pincode: {provider.location}</p>
                  <p>
                    Phone:{' '}
                    {unlockedProviderIds.includes(provider.id)
                      ? provider.phone
                      : maskPhoneNumber(provider.phone)}
                  </p>
                  {unlockedProviderIds.includes(provider.id) ? (
                    <a className="button button-primary" href={`tel:${provider.phone}`}>
                      Call Now
                    </a>
                  ) : (
                    <button
                      className="button button-primary"
                      disabled={unlockingProviderId === provider.id}
                      onClick={() => handleUnlock(provider.id)}
                      type="button"
                    >
                      {unlockingProviderId === provider.id ? 'Unlocking...' : 'Unlock Phone No'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  )
}

function ProviderAvatarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="provider-result-icon"
      fill="none"
      viewBox="0 0 64 64"
    >
      <circle cx="32" cy="22" fill="currentColor" opacity="0.18" r="12" />
      <path
        d="M32 34c-10.493 0-19 8.507-19 19h38c0-10.493-8.507-19-19-19Z"
        fill="currentColor"
        opacity="0.18"
      />
      <circle cx="32" cy="22" r="9" stroke="currentColor" strokeWidth="3" />
      <path
        d="M17 52c1.642-8.038 8.755-14 17-14s15.358 5.962 17 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

function maskPhoneNumber(phone: string) {
  if (phone.length <= 4) {
    return phone
  }

  return `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`
}
