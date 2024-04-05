import React from 'react'
import ReactDOM from 'react-dom/client'
import { StoreProvider } from './atoms/store'
import './index.css'
import { Router } from './router'

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <Router />
    </StoreProvider>
  </React.StrictMode>,
)
