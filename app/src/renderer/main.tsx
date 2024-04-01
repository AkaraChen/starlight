import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app'
import './index.css'
import { StoreProvider } from './atoms/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
)
