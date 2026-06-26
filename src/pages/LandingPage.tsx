import { ProviderJoinSection } from '../components/ProviderJoinSection'
import { howItWorksSteps, landingServices } from '../constants/services'
import { AppLink } from '../components/AppLink'
import { ROUTES } from '../lib/router'

type LandingPageProps = {
  isLoggedIn: boolean
  userLabel?: string
  walletBalance: number
}

export function LandingPage({
  isLoggedIn,
  userLabel,
  walletBalance,
}: LandingPageProps) {
  return (
    <main className="page-shell">
      <header className="topbar">
        <AppLink className="brand" to={ROUTES.home}>
          LOD
        </AppLink>

        <nav className="auth-actions" aria-label="Account actions">
          {isLoggedIn ? (
            <>
              <span className="user-pill">{userLabel || 'Logged In'}</span>
              <span className="wallet-pill">Wallet: {walletBalance} credits</span>
              <AppLink className="button button-primary" to={ROUTES.postRequirement}>
                Post Requirement
              </AppLink>
            </>
          ) : (
            <>
              <AppLink className="button button-ghost" to={ROUTES.signin}>
                Sign In
              </AppLink>
              <AppLink className="button button-primary" to={ROUTES.signup}>
                Sign Up
              </AppLink>
            </>
          )}
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">LOD - Labour ON Demand</p>
          <h1>Find Skilled Professionals Near You</h1>
          <p className="hero-text">
            Search local service providers, unlock their contact, and connect
            directly.
          </p>
          <p className="hero-services">
            Electrician | Plumber | Carpenter | Painter | Mason | Maid | Driver
            | AC Technician | More
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#services">
              Find a Professional
            </a>
            <a className="button button-secondary" href="#providers">
              Join as Provider
            </a>
          </div>

          <div className="hero-auth">
            <span className="hero-auth-label">
              {isLoggedIn
                ? `Wallet ready with ${walletBalance} credits.`
                : 'Already using LOD?'}
            </span>
            <div className="hero-auth-actions">
              {isLoggedIn ? (
                <>
                  <AppLink className="button button-secondary" to={ROUTES.profile}>
                    View Profile
                  </AppLink>
                  <AppLink className="button button-primary" to={ROUTES.postRequirement}>
                    Post Requirement
                  </AppLink>
                </>
              ) : (
                <>
                  <AppLink className="button button-ghost" to={ROUTES.signin}>
                    Sign In
                  </AppLink>
                  <AppLink className="button button-primary" to={ROUTES.signup}>
                    Sign Up
                  </AppLink>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="floating-card stat-card">
            <span className="card-label">Free welcome bonus</span>
            <strong>{isLoggedIn ? `${walletBalance} Credits` : '5 Credits'}</strong>
            <p>Unlock provider numbers right after signup.</p>
          </div>
          <div className="floating-card mini-card">
            <span>Direct contact</span>
            <strong>Call or WhatsApp</strong>
          </div>
          <div className="floating-card mini-card alt">
            <span>Local matching</span>
            <strong>Trusted nearby workers</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="feature-card accent-card">
          <p className="section-tag">Get 5 Free Credits</p>
          <h2>Start with instant access</h2>
          <p>Sign up on LOD and get 5 free credits instantly.</p>
          <div className="credit-box">
            <p>1 Credit = Unlock 1 Provider Contact</p>
            <p>5 Credits = Unlock 5 provider numbers</p>
          </div>
          <div className="inline-auth">
            <AppLink className="button button-primary" to={ROUTES.signup}>
              Create Free Account
            </AppLink>
            <AppLink className="button button-ghost" to={ROUTES.signin}>
              Already have an account?
            </AppLink>
          </div>
        </article>

        <article className="feature-card refer-card">
          <p className="section-tag">Refer &amp; Earn</p>
          <h2>Invite friends and both win</h2>
          <p>When your friend logs in:</p>
          <ul className="check-list">
            <li>Your friend gets 5 credits</li>
            <li>You get 5 credits</li>
          </ul>
        </article>
      </section>

      <section className="steps-section">
        <div className="section-heading">
          <p className="section-tag">How It Works</p>
          <h2>Find. Unlock. Connect.</h2>
        </div>

        <div className="steps-grid">
          {howItWorksSteps.map((step) => (
            <article key={step.number} className="step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <p className="section-tag">Popular Services</p>
          <h2>Everyday help, one search away</h2>
        </div>

        <div className="services-grid">
          {landingServices.map((service) => (
            <article key={service.name} className="service-pill">
              <span className="service-icon" aria-hidden="true">
                {service.icon}
              </span>
              <span>{service.name}</span>
            </article>
          ))}
        </div>
      </section>

      <ProviderJoinSection />
    </main>
  )
}
