import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DataWrapper } from './context/DataWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataWrapper>
      <App />
    </DataWrapper>
  </StrictMode>,
)
