import { useEffect, useState } from 'react'

export const ROUTES = {
  home: '/',
  signin: '/signin',
  signup: '/signup',
  postRequirement: '/post-requirement',
  profile: '/profile',
  providers: '/providers',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

const knownRoutes = new Set<AppRoute>(Object.values(ROUTES))

export function getCurrentRoute(): AppRoute {
  const pathname = window.location.pathname || ROUTES.home

  if (knownRoutes.has(pathname as AppRoute)) {
    return pathname as AppRoute
  }

  return ROUTES.home
}

export function navigate(to: AppRoute, options?: { replace?: boolean }) {
  const method = options?.replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useCurrentRoute() {
  const [route, setRoute] = useState<AppRoute>(() => getCurrentRoute())

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute())
    window.addEventListener('popstate', syncRoute)

    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  return route
}
