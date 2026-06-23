import { type FormEvent } from 'react'
import './App.css'
import { useData } from './context/DataWrapper'
import { PostRequirementPage } from './pages/PostRequirementPage'

const services = [
  { icon: '⚡', name: 'Electrician' },
  { icon: '🚰', name: 'Plumber' },
  { icon: '🪚', name: 'Carpenter' },
  { icon: '🎨', name: 'Painter' },
  { icon: '🧱', name: 'Mason' },
  { icon: '🧹', name: 'Maid' },
  { icon: '🚗', name: 'Driver' },
  { icon: '❄', name: 'AC Technician' },
  { icon: '👷', name: 'Helper' },
  { icon: '🙏', name: 'Pandit' },
]

const steps = [
  { number: '1', title: 'Search', description: 'Choose the service you need.' },
  {
    number: '2',
    title: 'View',
    description: 'Check provider profile, area and experience.',
  },
  {
    number: '3',
    title: 'Unlock',
    description: 'Use 1 credit to unlock phone number.',
  },
  {
    number: '4',
    title: 'Connect',
    description: 'Call or WhatsApp the provider directly.',
  },
]

type ViewName = 'home' | 'signin' | 'signup' | 'post-requirement'

function getView(): ViewName {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')

  if (view === 'signin' || view === 'signup' || view === 'post-requirement') {
    return view
  }

  return 'home'
}

function goTo(view: ViewName) {
  const nextUrl = view === 'home' ? '/' : `/?view=${view}`
  window.location.href = nextUrl
}

function App() {
  const { isLoggedIn, currentUser } = useData()
  const view = getView()

  if (view === 'post-requirement') {
    if (!isLoggedIn) {
      return <ProtectedMessage />
    }

    return <PostRequirementPage onBackHome={() => goTo('home')} />
  }

  if (view === 'signin') {
    return <AuthPage mode="signin" />
  }

  if (view === 'signup') {
    return <AuthPage mode="signup" />
  }

  return <LandingPage isLoggedIn={isLoggedIn} userLabel={currentUser?.fullName || currentUser?.email} />
}

function LandingPage({
  isLoggedIn,
  userLabel,
}: {
  isLoggedIn: boolean
  userLabel?: string
}) {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          LOD
        </a>

        <nav className="auth-actions" aria-label="Account actions">
          {isLoggedIn ? (
            <>
              <span className="user-pill">{userLabel || 'Logged In'}</span>
              <a className="button button-primary" href="/?view=post-requirement">
                Post Requirement
              </a>
            </>
          ) : (
            <>
              <a className="button button-ghost" href="/?view=signin">
                Sign In
              </a>
              <a className="button button-primary" href="/?view=signup">
                Sign Up
              </a>
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
            Electrician • Plumber • Carpenter • Painter • Mason • Maid • Driver
            • AC Technician &amp; More
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
                ? 'You can now post your service requirement.'
                : 'Already using LOD?'}
            </span>
            <div className="hero-auth-actions">
              {isLoggedIn ? (
                <a className="button button-primary" href="/?view=post-requirement">
                  Post Requirement
                </a>
              ) : (
                <>
                  <a className="button button-ghost" href="/?view=signin">
                    Sign In
                  </a>
                  <a className="button button-primary" href="/?view=signup">
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="floating-card stat-card">
            <span className="card-label">Free welcome bonus</span>
            <strong>5 Credits</strong>
            <p>Unlock 5 provider numbers right after signup.</p>
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
            <a className="button button-primary" href="/?view=signup">
              Create Free Account
            </a>
            <a className="button button-ghost" href="/?view=signin">
              Already have an account?
            </a>
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
          {steps.map((step) => (
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
          {services.map((service) => (
            <article key={service.name} className="service-pill">
              <span className="service-icon" aria-hidden="true">
                {service.icon}
              </span>
              <span>{service.name}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="provider-section" id="providers">
        <div className="provider-copy">
          <p className="section-tag">For Service Providers</p>
          <h2>Get More Customers With LOD</h2>
          <p>
            Join for free and let customers find you. No app knowledge required.
            Call or WhatsApp us and our team will create your profile.
          </p>
        </div>

        <div className="provider-actions">
          <a className="button button-primary" href="tel:+910000000000">
            Call Us
          </a>
          <a
            className="button button-secondary"
            href="https://wa.me/910000000000"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </main>
  )
}

function ProtectedMessage() {
  return (
    <main className="auth-page">
      <section className="protected-card">
        <p className="section-tag">Login Required</p>
        <h2>Sign in to post your requirement</h2>
        <p>
          This page is only accessible for logged-in users. Please sign in or
          create an account first.
        </p>
        <div className="inline-auth">
          <a className="button button-primary" href="/?view=signin">
            Sign In
          </a>
          <a className="button button-ghost" href="/?view=signup">
            Sign Up
          </a>
        </div>
      </section>
    </main>
  )
}

type AuthPageProps = {
  mode: 'signin' | 'signup'
}

function AuthPage({ mode }: AuthPageProps) {
  const isSignUp = mode === 'signup'
  const { signIn, signUp } = useData()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const profile = {
      fullName: String(formData.get('fullName') || ''),
      mobile: String(formData.get('mobile') || ''),
      email: String(formData.get('email') || ''),
      streetAddress: String(formData.get('streetAddress') || ''),
      area: String(formData.get('area') || ''),
      city: String(formData.get('city') || ''),
      state: String(formData.get('state') || ''),
      pincode: String(formData.get('pincode') || ''),
    }

    if (isSignUp) {
      signUp(profile)
    } else {
      signIn(profile)
    }

    goTo('post-requirement')
  }

  return (
    <main className="auth-page">
      <section className="auth-layout">
        <aside className="auth-aside">
          <a className="brand" href="/">
            LOD
          </a>
          <p className="eyebrow">Labour ON Demand</p>
          <h1>{isSignUp ? 'Create your LOD account' : 'Welcome back to LOD'}</h1>
          <p className="auth-lead">
            {isSignUp
              ? 'Get 5 free credits instantly and start unlocking provider contacts near you.'
              : 'Sign in to manage credits, unlock contacts, and connect with local professionals.'}
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit-card">
              <strong>5 free credits</strong>
              <span>Unlock provider contacts after signup.</span>
            </div>
            <div className="auth-benefit-card">
              <strong>Direct connection</strong>
              <span>Call or WhatsApp providers without waiting.</span>
            </div>
            <div className="auth-benefit-card">
              <strong>Trusted local services</strong>
              <span>Find electricians, plumbers, drivers and more.</span>
            </div>
          </div>
        </aside>

        <section className="auth-card">
          <div className="auth-card-head">
            <p className="section-tag">{isSignUp ? 'Sign Up' : 'Sign In'}</p>
            <h2>{isSignUp ? 'Start in less than a minute' : 'Access your account'}</h2>
            <p>
              {isSignUp
                ? 'Create your account to unlock providers and start with free credits.'
                : 'Use your mobile number or email to continue.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp ? (
              <>
                <label className="form-field">
                  <span>Full Name</span>
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                  />
                </label>

                <label className="form-field">
                  <span>Street Address</span>
                  <input
                    name="streetAddress"
                    type="text"
                    placeholder="House number, street, landmark"
                  />
                </label>

                <div className="form-grid">
                  <label className="form-field">
                    <span>Area / Locality</span>
                    <input name="area" type="text" placeholder="Enter your area" />
                  </label>

                  <label className="form-field">
                    <span>City</span>
                    <input name="city" type="text" placeholder="Enter your city" />
                  </label>
                </div>

                <div className="form-grid">
                  <label className="form-field">
                    <span>State</span>
                    <input name="state" type="text" placeholder="Enter your state" />
                  </label>

                  <label className="form-field">
                    <span>Pincode</span>
                    <input name="pincode" type="text" placeholder="Enter your pincode" />
                  </label>
                </div>
              </>
            ) : null}

            <label className="form-field">
              <span>Mobile Number</span>
              <input
                required
                name="mobile"
                type="tel"
                placeholder="Enter your mobile number"
              />
            </label>

            <label className="form-field">
              <span>Email Address</span>
              <input
                required
                name="email"
                type="email"
                placeholder="Enter your email address"
              />
            </label>

            <label className="form-field">
              <span>Password</span>
              <input
                required
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </label>

            {isSignUp ? (
              <label className="form-field">
                <span>Confirm Password</span>
                <input
                  required
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                />
              </label>
            ) : null}

            <button className="button button-primary auth-submit" type="submit">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <a className="auth-link" href="/">
              Back to home
            </a>
            <a
              className="auth-link"
              href={isSignUp ? '/?view=signin' : '/?view=signup'}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : 'New here? Create an account'}
            </a>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
