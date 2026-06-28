import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import { postJson } from '../lib/api'
import type {
  RequirementSearchContext,
  RequirementRecord,
  ServiceProvider,
  UserProfile,
  WalletSpendEntry,
  WalletState,
} from '../types/lod'

type DataContextValue = {
  isLoggedIn: boolean
  currentUser: UserProfile | null
  requirements: RequirementRecord[]
  matchedProviders: ServiceProvider[]
  wallet: WalletState
  unlockedProviderIds: string[]
  lastRequirementSearch: RequirementSearchContext | null
  signIn: (input: { email: string; password: string }) => Promise<UserProfile>
  signUp: (input: UserProfile & { password: string }) => Promise<UserProfile>
  signOut: () => void
  addRequirement: (input: {
    service: string
    requirement: string
    pincode: string
    userEmail?: string
  }) => Promise<{ requirement: RequirementRecord; providers: ServiceProvider[] }>
  unlockProviderPhone: (input: {
    provider: ServiceProvider
  }) => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

const AUTH_STORAGE_KEY = 'lod-auth'
const REQUIREMENTS_STORAGE_KEY = 'lod-requirements'
const MATCHED_PROVIDERS_STORAGE_KEY = 'lod-matched-providers'
const WALLET_STORAGE_KEY = 'lod-wallet'
const UNLOCKED_PROVIDER_IDS_STORAGE_KEY = 'lod-unlocked-provider-ids'
const LAST_REQUIREMENT_SEARCH_STORAGE_KEY = 'lod-last-requirement-search'
const SIGNUP_BONUS = 5
const DEFAULT_WALLET: WalletState = {
  balance: SIGNUP_BONUS,
  transactions: [
    {
      id: 'welcome-bonus',
      type: 'credit',
      amount: SIGNUP_BONUS,
      note: 'Welcome bonus added to your wallet.',
      createdAt: new Date().toISOString(),
    },
  ],
}

function readStoredAuth() {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
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

function readStoredWallet() {
  const raw = window.localStorage.getItem(WALLET_STORAGE_KEY)

  if (!raw) {
    return DEFAULT_WALLET
  }

  try {
    const parsed = JSON.parse(raw) as WalletState

    if (
      typeof parsed?.balance === 'number' &&
      Array.isArray(parsed.transactions)
    ) {
      return parsed
    }
  } catch {
    return DEFAULT_WALLET
  }

  return DEFAULT_WALLET
}

function readStoredMatchedProviders() {
  const raw = window.localStorage.getItem(MATCHED_PROVIDERS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as ServiceProvider[]
  } catch {
    return []
  }
}

function readStoredUnlockedProviderIds() {
  const raw = window.localStorage.getItem(UNLOCKED_PROVIDER_IDS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readLastRequirementSearch() {
  const raw = window.localStorage.getItem(LAST_REQUIREMENT_SEARCH_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as RequirementSearchContext
    if (typeof parsed?.service === 'string' && typeof parsed?.pincode === 'string') {
      return parsed
    }
  } catch {
    return null
  }

  return null
}

function mapWalletSpendEntryToTransaction(entry: WalletSpendEntry) {
  return {
    id: entry.id,
    type: 'debit' as const,
    amount: entry.amount,
    note: `Unlocked ${entry.providerName || entry.unlockedPhone} for ${entry.service}.`,
    createdAt: entry.createdAt,
  }
}

function buildWalletStateFromUser(user: UserProfile | null, fallback: WalletState) {
  if (!user) {
    return fallback
  }

  const backendTransactions = Array.isArray(user.walletSpentHistory)
    ? user.walletSpentHistory.map(mapWalletSpendEntryToTransaction)
    : []

  if (typeof user.walletBalance !== 'number' && backendTransactions.length === 0) {
    return fallback
  }

  return {
    balance: typeof user.walletBalance === 'number' ? user.walletBalance : fallback.balance,
    transactions: backendTransactions.length > 0 ? backendTransactions.reverse() : fallback.transactions,
  }
}
export const DEMO_USER: UserProfile = {
  email: 'demo@lod.in',
  fullName: 'Demo Customer',
  mobile: '9876543210',
  streetAddress: '221B Demo Street',
  area: 'Indiranagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  walletBalance: SIGNUP_BONUS,
}

export function DataWrapper({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    readStoredAuth(),
  )
  const [requirements, setRequirements] = useState<RequirementRecord[]>(() =>
    readStoredRequirements(),
  )
  const [matchedProviders, setMatchedProviders] = useState<ServiceProvider[]>(() =>
    readStoredMatchedProviders(),
  )
  const [wallet, setWallet] = useState<WalletState>(() => readStoredWallet())
  const [unlockedProviderIds, setUnlockedProviderIds] = useState<string[]>(() =>
    readStoredUnlockedProviderIds(),
  )
  const [lastRequirementSearch, setLastRequirementSearch] =
    useState<RequirementSearchContext | null>(() => readLastRequirementSearch())

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

  const persistWallet = (nextWallet: WalletState) => {
    setWallet(nextWallet)
    window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(nextWallet))
  }

  const persistMatchedProviders = (nextProviders: ServiceProvider[]) => {
    setMatchedProviders(nextProviders)
    window.localStorage.setItem(
      MATCHED_PROVIDERS_STORAGE_KEY,
      JSON.stringify(nextProviders),
    )
  }

  const persistUnlockedProviderIds = (nextUnlockedProviderIds: string[]) => {
    setUnlockedProviderIds(nextUnlockedProviderIds)
    window.localStorage.setItem(
      UNLOCKED_PROVIDER_IDS_STORAGE_KEY,
      JSON.stringify(nextUnlockedProviderIds),
    )
  }

  const persistLastRequirementSearch = (search: RequirementSearchContext | null) => {
    setLastRequirementSearch(search)

    if (search) {
      window.localStorage.setItem(
        LAST_REQUIREMENT_SEARCH_STORAGE_KEY,
        JSON.stringify(search),
      )
      return
    }

    window.localStorage.removeItem(LAST_REQUIREMENT_SEARCH_STORAGE_KEY)
  }

  const value: DataContextValue = {
    isLoggedIn: currentUser !== null,
    currentUser,
    requirements,
    matchedProviders,
    wallet,
    unlockedProviderIds,
    lastRequirementSearch,
    signIn: async ({ email, password }) => {
      const data = await postJson<{ user: UserProfile }>('/api/signin', {
        email,
        password,
      })
      persistAuth(data.user)
      persistWallet(buildWalletStateFromUser(data.user, wallet))
      return data.user
    },
    signUp: async (profile) => {
      const data = await postJson<{ user: UserProfile }>('/api/signup', profile)
      persistAuth(data.user)
      persistWallet({
        balance: SIGNUP_BONUS,
        transactions: [
          {
            id: crypto.randomUUID(),
            type: 'credit',
            amount: SIGNUP_BONUS,
            note: 'Signup bonus credited to your wallet.',
            createdAt: new Date().toISOString(),
          },
        ],
      })
      return data.user
    },
    signOut: () => {
      persistAuth(null)
      persistMatchedProviders([])
      persistUnlockedProviderIds([])
      persistLastRequirementSearch(null)
    },
    addRequirement: async (input) => {
      const data = await postJson<{
        requirement: {
          id: string
          service: string
          requirement: string
          pincode: string
          createdAt: string
        }
        providers: ServiceProvider[]
      }>('/api/post-requirement', input)

      const nextRequirement: RequirementRecord = {
        id: data.requirement.id,
        createdAt: data.requirement.createdAt,
        title: `${data.requirement.service || 'Custom requirement'} requirement`,
        description: `${data.requirement.requirement || 'Requirement posted'} | Pincode: ${data.requirement.pincode}`,
      }

      persistRequirements([nextRequirement, ...requirements])
      persistMatchedProviders(data.providers)
      persistUnlockedProviderIds([])
      persistLastRequirementSearch({
        service: data.requirement.service || input.service,
        pincode: data.requirement.pincode,
      })
      return {
        requirement: nextRequirement,
        providers: data.providers,
      }
    },
    unlockProviderPhone: async ({ provider }) => {
      if (!currentUser?.email) {
        throw new Error('Please sign in to unlock provider phone numbers.')
      }

      const service = lastRequirementSearch?.service || provider.service
      const searchedPincode = lastRequirementSearch?.pincode || provider.location

      const data = await postJson<{
        walletBalance: number
        spentCredit: WalletSpendEntry
        user: UserProfile
      }>('/api/spent-credit', {
        email: currentUser.email,
        service,
        providerId: provider.id,
        unlockedPhone: provider.phone,
        providerName: provider.name,
        searchedPincode,
      })

      persistAuth(data.user)
      persistWallet(buildWalletStateFromUser(data.user, {
        balance: data.walletBalance,
        transactions: [mapWalletSpendEntryToTransaction(data.spentCredit), ...wallet.transactions],
      }))

      if (!unlockedProviderIds.includes(provider.id)) {
        persistUnlockedProviderIds([...unlockedProviderIds, provider.id])
      }
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
