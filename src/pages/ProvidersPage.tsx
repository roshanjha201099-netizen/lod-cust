import { useData } from '../context/DataWrapper'
import { ROUTES, navigate } from '../lib/router'
import { AppLink } from '../components/AppLink'

export function ProvidersPage() {
  const { matchedProviders } = useData()

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
            <strong>{matchedProviders.length}</strong>
            <span>provider(s) found for your request</span>
          </div>
        </div>

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
                  <img
                    alt={provider.name}
                    className="provider-result-image"
                    src={provider.picUrl}
                  />
                </div>
                <div className="provider-result-body">
                  <div className="post-history-card-head">
                    <strong>{provider.name}</strong>
                    <span>{provider.rating.toFixed(1)} rating</span>
                  </div>
                  <p>{provider.service}</p>
                  <p>Pincode: {provider.location}</p>
                  <p>Phone: {provider.phone}</p>
                  <a className="button button-primary" href={`tel:${provider.phone}`}>
                    Call Now
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  )
}
