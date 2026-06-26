import { useEffect } from 'react'
import './App.css'
import { FloatingProfileButton } from './components/FloatingProfileButton'
import { useData } from './context/DataWrapper'
import { ROUTES, navigate, useCurrentRoute } from './lib/router'
import { AuthPage } from './pages/AuthPage'
import { LandingPage } from './pages/LandingPage'
import { PostRequirementPage } from './pages/PostRequirementPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedMessagePage } from './pages/ProtectedMessagePage'
import { ProvidersPage } from './pages/ProvidersPage'

function RouteRedirect({ to }: { to: (typeof ROUTES)[keyof typeof ROUTES] }) {
  useEffect(() => {
    navigate(to, { replace: true })
  }, [to])

  return null
}

function App() {
  const { isLoggedIn, currentUser, wallet } = useData()
  const route = useCurrentRoute()

  if (route === ROUTES.postRequirement) {
    if (!isLoggedIn) {
      return (
        <>
          <ProtectedMessagePage />
          <FloatingProfileButton isLoggedIn={false} />
        </>
      )
    }

    return (
      <>
        <PostRequirementPage />
        <FloatingProfileButton isLoggedIn />
      </>
    )
  }

  if (route === ROUTES.providers) {
    if (!isLoggedIn) {
      return <RouteRedirect to={ROUTES.signin} />
    }

    return (
      <>
        <ProvidersPage />
        <FloatingProfileButton isLoggedIn />
      </>
    )
  }

  if (route === ROUTES.profile) {
    if (!isLoggedIn) {
      return <RouteRedirect to={ROUTES.signin} />
    }

    return (
      <>
        <ProfilePage />
        <FloatingProfileButton isLoggedIn />
      </>
    )
  }

  if (route === ROUTES.signin) {
    return (
      <>
        <AuthPage mode="signin" />
        <FloatingProfileButton isLoggedIn={false} />
      </>
    )
  }

  if (route === ROUTES.signup) {
    return (
      <>
        <AuthPage mode="signup" />
        <FloatingProfileButton isLoggedIn={false} />
      </>
    )
  }

  return (
    <>
      <LandingPage
        isLoggedIn={isLoggedIn}
        userLabel={currentUser?.fullName || currentUser?.email}
        walletBalance={wallet.balance}
      />
      <FloatingProfileButton isLoggedIn={isLoggedIn} />
    </>
  )
}

export default App
