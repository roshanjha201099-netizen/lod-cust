export const landingServices = [
  { icon: 'EL', name: 'Electrician' },
  { icon: 'PL', name: 'Plumber' },
  { icon: 'CA', name: 'Carpenter' },
  { icon: 'PA', name: 'Painter' },
  { icon: 'MA', name: 'Mason' },
  { icon: 'MD', name: 'Maid' },
  { icon: 'DR', name: 'Driver' },
  { icon: 'AC', name: 'AC Technician' },
  { icon: 'HP', name: 'Helper' },
  { icon: 'PD', name: 'Pandit' },
] as const

export const howItWorksSteps = [
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
] as const

export const serviceOptions = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Mason',
  'Maid',
  'Driver',
  'AC Technician',
  'Helper',
] as const
