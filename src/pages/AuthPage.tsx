import { type FormEvent, useState } from 'react'
import { DEMO_USER, useData } from '../context/DataWrapper'
import { ROUTES, navigate } from '../lib/router'
import { AppLink } from '../components/AppLink'

type AuthPageProps = {
  mode: 'signin' | 'signup'
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignUp = mode === 'signup'
  const { signIn, signUp } = useData()
  const [authError, setAuthError] = useState('')

  const handleDemoSignIn = async () => {
    try {
      await signUp({
        ...DEMO_USER,
        password: 'demo123',
      })
      setAuthError('')
      navigate(ROUTES.postRequirement)
    } catch (signupError) {
      try {
        await signIn({
          email: DEMO_USER.email,
          password: 'demo123',
        })
        setAuthError('')
        navigate(ROUTES.postRequirement)
      } catch (signinError) {
        setAuthError(
          signinError instanceof Error
            ? signinError.message
            : signupError instanceof Error
              ? signupError.message
              : 'Unable to continue with demo user.',
        )
      }
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')

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

    // Client-side validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRegex.test(profile.email)) {
      setAuthError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.')
      return
    }

    if (isSignUp) {
      const mobileRegex = /^\d{10}$/
      if (!mobileRegex.test(profile.mobile)) {
        setAuthError('Please enter a valid 10-digit mobile number.')
        return
      }
    }

    try {
      if (isSignUp) {
        const confirmPassword = String(formData.get('confirmPassword') || '')
        if (password !== confirmPassword) {
          setAuthError('Password and confirm password must match.')
          return
        }

        await signUp({
          ...profile,
          password,
        })
      } else {
        await signIn({
          email: profile.email,
          password,
        })
      }

      setAuthError('')
      navigate(ROUTES.postRequirement)
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Unable to complete authentication.',
      )
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-layout">
        <aside className="auth-aside">
          <AppLink className="brand" to={ROUTES.home}>
            LOD
          </AppLink>
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
            {!isSignUp ? (
              <div className="demo-user-card">
                <div>
                  <strong>Demo user</strong>
                  <p>
                    Use the sample account to explore the app instantly: demo@lod.in
                  </p>
                </div>
                <button
                  className="button button-secondary auth-demo-button"
                  type="button"
                  onClick={handleDemoSignIn}
                >
                  Continue with Demo User
                </button>
              </div>
            ) : null}

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
            {authError ? <p className="form-message error-message">{authError}</p> : null}
          </form>

          <div className="auth-footer">
            <AppLink className="auth-link" to={ROUTES.home}>
              Back to home
            </AppLink>
            <AppLink
              className="auth-link"
              to={isSignUp ? ROUTES.signin : ROUTES.signup}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : 'New here? Create an account'}
            </AppLink>
          </div>
        </section>
      </section>
    </main>
  )
}
