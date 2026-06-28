export type UserProfile = {
  email: string
  fullName?: string
  mobile?: string
  streetAddress?: string
  area?: string
  city?: string
  state?: string
  pincode?: string
  walletBalance?: number
  walletSpentHistory?: WalletSpendEntry[]
}

export type RequirementInput = {
  title: string
  description: string
  imageName?: string
  audioName?: string
  videoName?: string
}

export type ServiceProvider = {
  id: string
  name: string
  location: string
  phone: string
  service: string
  rating: number
  picUrl: string
}

export type RequirementRecord = RequirementInput & {
  id: string
  createdAt: string
}

export type WalletTransaction = {
  id: string
  type: 'credit' | 'debit'
  amount: number
  note: string
  createdAt: string
}

export type WalletState = {
  balance: number
  transactions: WalletTransaction[]
}

export type WalletSpendEntry = {
  id: string
  service: string
  amount: number
  unlockedPhone: string
  providerId?: string
  providerName?: string
  searchedPincode?: string
  createdAt: string
}

export type RequirementSearchContext = {
  service: string
  pincode: string
}
