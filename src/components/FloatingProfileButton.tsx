import { AppLink } from './AppLink'
import { ROUTES } from '../lib/router'

export function FloatingProfileButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <AppLink
      className="floating-profile-button"
      to={isLoggedIn ? ROUTES.profile : ROUTES.signin}
      aria-label={isLoggedIn ? 'View profile page' : 'View login page'}
      title={isLoggedIn ? 'Profile' : 'Login'}
    >
      <span className="floating-profile-icon" aria-hidden="true">
        {isLoggedIn ? 'P' : 'L'}
      </span>
    </AppLink>
  )
}
