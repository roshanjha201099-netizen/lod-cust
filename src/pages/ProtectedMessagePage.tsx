import { AppLink } from '../components/AppLink'
import { ROUTES } from '../lib/router'

export function ProtectedMessagePage() {
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
          <AppLink className="button button-primary" to={ROUTES.signin}>
            Sign In
          </AppLink>
          <AppLink className="button button-ghost" to={ROUTES.signup}>
            Sign Up
          </AppLink>
        </div>
      </section>
    </main>
  )
}
