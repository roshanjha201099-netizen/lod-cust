import { ProviderJoinSection } from '../components/ProviderJoinSection'
import { howItWorksSteps, landingServices } from '../constants/services'
import { AppLink } from '../components/AppLink'
import { ROUTES } from '../lib/router'

type LandingPageProps = {
  isLoggedIn: boolean
  userLabel?: string
  walletBalance: number
}

type BenefitIconType = 'shield' | 'pin' | 'phone' | 'wallet'

export function LandingPage({
  isLoggedIn,
  userLabel,
  walletBalance,
}: LandingPageProps) {
  const trustPoints: Array<{
    icon: BenefitIconType
    title: string
    description: string
  }> = [
    {
      icon: 'shield',
      title: 'Verified & Trusted Providers',
      description: 'Every provider is screened so customers can book with confidence.',
    },
    {
      icon: 'pin',
      title: 'Local & Nearby Matches',
      description: 'Providers are shown based on your area and pincode search.',
    },
    {
      icon: 'phone',
      title: 'Direct Contact',
      description: 'Unlock once, call directly, and skip waiting for callbacks.',
    },
    {
      icon: 'wallet',
      title: 'Simple Credit Pricing',
      description: 'One unlock costs one credit, with no hidden contact charges.',
    },
  ]

  const stats = [
    { value: '1000+', label: 'Verified Providers' },
    { value: '50+', label: 'Service Categories' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '4.8', label: 'Average Rating' },
  ]

  return (
    <main className="page-shell landing-page-shell">
      <header className="landing-topbar">
        <div className="landing-brand-lockup">
          <AppLink className="landing-brand" to={ROUTES.home}>
            LOD
          </AppLink>
          <span className="landing-brand-tagline">Labour On Demand</span>
        </div>

        <div className="landing-location-chip" aria-label="Current service area">
          <span className="landing-location-icon" aria-hidden="true">
            <LocationPinIcon className="landing-location-icon-svg" />
          </span>
          <span>Barrackpore</span>
        </div>

        <nav className="landing-nav" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#services">Categories</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#providers">For Providers</a>
          <a href="#benefits">Help</a>
        </nav>

        <div className="landing-account-area">
          {isLoggedIn ? (
            <>
              <span className="landing-user-chip">{userLabel || 'Logged In'}</span>
              <AppLink className="landing-login-button" to={ROUTES.postRequirement}>
                Search Now
              </AppLink>
            </>
          ) : (
            <AppLink className="landing-login-button" to={ROUTES.signin}>
              Login / Sign Up
            </AppLink>
          )}
        </div>
      </header>

      <section className="directory-hero" id="home">
        <div className="directory-hero-copy">
          <p className="directory-eyebrow">Trusted local labour, on demand</p>
          <h1 className="directory-hero-title">
            Find Trusted Local <span>Professionals in Minutes</span>
          </h1>
          <p className="directory-hero-text">
            Electrician, plumber, carpenter, painter and more. Search verified
            nearby experts and unlock direct contact instantly.
          </p>

          <div className="directory-search-panel">
            <div className="directory-search-field">
              <span>What service do you need?</span>
              <strong>Electrician, Plumber, Carpenter...</strong>
            </div>
            <div className="directory-search-field">
              <span>Preferred area</span>
              <strong>Your city or pincode</strong>
            </div>
            <AppLink className="directory-search-button" to={ROUTES.postRequirement}>
              Search
            </AppLink>
          </div>

          <div className="directory-trust-row">
            <span>Verified Providers</span>
            <span>Local & Nearby</span>
            <span>Quick Contact</span>
          </div>
        </div>

        <div className="directory-hero-visual">
          <div className="directory-hero-portrait">
            <img
              alt="Verified local worker ready to help"
              className="directory-hero-image"
              src="/labour.png"
            />
            <div className="directory-worker-card">
              <span className="directory-worker-badge">LOD Verified</span>
              <strong>Fast local help</strong>
              <p>Connect with nearby workers without middlemen.</p>
            </div>
          </div>
          <div className="directory-wallet-card">
            <p>Wallet Balance</p>
            <strong>{isLoggedIn ? walletBalance : 5} Credits</strong>
            <span>1 credit unlocks 1 provider phone number.</span>
          </div>
        </div>
      </section>

      <section className="directory-section" id="services">
        <div className="directory-section-head">
          <div>
            <p className="section-tag">Popular Services</p>
            <h2>Browse services people use every day</h2>
          </div>
          <a className="directory-view-link" href="#providers">
            View all
          </a>
        </div>

        <div className="directory-services-grid">
          {landingServices.map((service) => (
            <article key={service.name} className="directory-service-card">
              <span className="directory-service-icon" aria-hidden="true">
                <ServiceIcon name={service.name} />
              </span>
              <strong>{service.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="directory-section directory-benefits" id="benefits">
        <div className="directory-section-head">
          <div>
            <p className="section-tag">Why Choose LOD?</p>
            <h2>Made for faster local hiring</h2>
          </div>
        </div>

        <div className="directory-benefit-grid">
          {trustPoints.map((point) => (
            <article key={point.title} className="directory-benefit-card">
              <span className="directory-benefit-icon" aria-hidden="true">
                <BenefitIcon type={point.icon} />
              </span>
              <div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="directory-section" id="how-it-works">
        <div className="directory-how-layout">
          <div className="directory-how-flow">
            <div className="directory-section-head">
              <div>
                <p className="section-tag">How It Works</p>
                <h2>Search, unlock, and call directly</h2>
              </div>
            </div>

            <div className="directory-steps-grid">
              {howItWorksSteps.map((step) => (
                <article key={step.number} className="directory-step-card">
                  <span className="directory-step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="directory-wallet-panel">
            <p className="section-tag">Your Wallet</p>
            <strong>{isLoggedIn ? walletBalance : 5} Credits</strong>
            <p>
              {isLoggedIn
                ? 'Your account is ready to unlock provider contacts.'
                : 'Sign up and start with 5 free credits instantly.'}
            </p>
            <AppLink
              className="button button-primary directory-wallet-button"
              to={isLoggedIn ? ROUTES.postRequirement : ROUTES.signup}
            >
              {isLoggedIn ? 'Use Credits' : 'Get Free Credits'}
            </AppLink>
          </aside>
        </div>
      </section>

      <section className="directory-cta-strip">
        <article className="directory-cta-card">
          <p className="section-tag">Are you a service provider?</p>
          <h3>Join LOD and get more local customers.</h3>
          <a className="button button-secondary" href="#providers">
            Join as Provider
          </a>
        </article>

        <article className="directory-cta-card directory-cta-card-accent">
          <p className="section-tag">Earn Free Credits</p>
          <h3>Refer your friends and both of you get 5 free credits.</h3>
          <AppLink
            className="button button-primary"
            to={isLoggedIn ? ROUTES.profile : ROUTES.signup}
          >
            Refer Now
          </AppLink>
        </article>
      </section>

      <section className="directory-stats-strip">
        {stats.map((stat) => (
          <article key={stat.label} className="directory-stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <ProviderJoinSection />
    </main>
  )
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  )
}

function ServiceIcon({ name }: { name: string }) {
  const className = 'directory-service-icon-svg'

  switch (name) {
    case 'Electrician':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path d="m13 2-7 11h5l-1 9 8-12h-5l0-8Z" fill="currentColor" />
        </svg>
      )
    case 'Plumber':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M8 3v5l3 3v4a3 3 0 1 0 6 0v-4l-3-3V3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'Carpenter':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="m6 18 8-8 4 4-8 8H6v-4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path d="m12 6 2-2 4 4-2 2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'Painter':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M4 14h10l4 4-2 2-4-4V6H4v8Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'Mason':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M4 8h16M4 14h16M8 4v4m8-4v4m-8 6v6m8-6v6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'Maid':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M7 4h6l4 4-6 6-4-4V4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path d="m13 14 5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      )
    case 'Driver':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M5 15V9l2-3h10l2 3v6H5Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <circle cx="8" cy="15" r="1.7" fill="currentColor" />
          <circle cx="16" cy="15" r="1.7" fill="currentColor" />
        </svg>
      )
    case 'AC Technician':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <rect
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
            width="16"
            x="4"
            y="6"
          />
          <path
            d="M8 18c1 1 1 2 0 3m4-3c1 1 1 2 0 3m4-3c1 1 1 2 0 3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'Helper':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="7" fill="currentColor" r="2.5" />
          <path
            d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'Pandit':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M12 3v18M7 8h10M7 16h10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" fill="currentColor" r="2.5" />
          <path
            d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      )
  }
}

function BenefitIcon({ type }: { type: BenefitIconType }) {
  const className = 'directory-benefit-icon-svg'

  switch (type) {
    case 'shield':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M12 3 6 5v5c0 4 2.4 7.4 6 8.9 3.6-1.5 6-4.9 6-8.9V5l-6-2Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path d="m9.5 11.5 1.7 1.7 3.3-3.7" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'pin':
      return <LocationPinIcon className={className} />
    case 'phone':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M7.5 4h3l1.2 4-1.8 1.8a15 15 0 0 0 4.3 4.3l1.8-1.8 4 1.2v3c0 .8-.7 1.5-1.5 1.5C10.5 19 5 13.5 5 6.5 5 5.7 5.7 5 6.5 5Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'wallet':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24">
          <path
            d="M5 7.5A2.5 2.5 0 0 1 7.5 5H18v14H7.5A2.5 2.5 0 0 1 5 16.5v-9Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path d="M18 10h-4.5a1.5 1.5 0 0 0 0 3H18" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
  }
}
