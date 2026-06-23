import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type UserProfile = {
  email: string
  fullName?: string
  mobile?: string
  streetAddress?: string
  area?: string
  city?: string
  state?: string
  pincode?: string
}

type RequirementInput = {
  title: string
  description: string
  imageName?: string
  audioName?: string
  videoName?: string
}

type RequirementRecord = RequirementInput & {
  id: string
  createdAt: string
}

type DataContextValue = {
  isLoggedIn: boolean
  currentUser: UserProfile | null
  requirements: RequirementRecord[]
  signIn: (profile: UserProfile) => void
  signUp: (profile: UserProfile) => void
  signOut: () => void
  addRequirement: (input: RequirementInput) => void
}

const DataContext = createContext<DataContextValue | null>(null)

const AUTH_STORAGE_KEY = 'lod-auth'
const REQUIREMENTS_STORAGE_KEY = 'lod-requirements'
const DEMO_USER: UserProfile = {
  fullName: 'Demo Customer',
  mobile: '9876543210',
  email: 'demo@lod.in',
  streetAddress: '221B Demo Street',
  area: 'Indiranagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
}

function readStoredAuth() {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!raw) {
    return DEMO_USER
  }

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return DEMO_USER
  }
}

function readStoredRequirements() {
  const raw = window.localStorage.getItem(REQUIREMENTS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as RequirementRecord[]
  } catch {
    return []
  }
}

export function DataWrapper({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [requirements, setRequirements] = useState<RequirementRecord[]>([])

  useEffect(() => {
    setCurrentUser(readStoredAuth())
    setRequirements(readStoredRequirements())
  }, [])

  const persistAuth = (profile: UserProfile | null) => {
    setCurrentUser(profile)

    if (profile) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile))
      return
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const persistRequirements = (nextRequirements: RequirementRecord[]) => {
    setRequirements(nextRequirements)
    window.localStorage.setItem(
      REQUIREMENTS_STORAGE_KEY,
      JSON.stringify(nextRequirements),
    )
  }

  const value: DataContextValue = {
    isLoggedIn: currentUser !== null,
    currentUser,
    requirements,
    signIn: (profile) => {
      persistAuth(profile)
    },
    signUp: (profile) => {
      persistAuth(profile)
    },
    signOut: () => {
      persistAuth(null)
    },
    addRequirement: (input) => {
      const nextRequirement: RequirementRecord = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      persistRequirements([nextRequirement, ...requirements])
    },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)

  if (!context) {
    throw new Error('useData must be used within DataWrapper')
  }

  return context
}
