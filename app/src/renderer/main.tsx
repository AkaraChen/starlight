import React from 'react'
import ReactDOM from 'react-dom/client'
import { StoreProvider } from './atoms/store'
import App from './components/app'
import './index.css'

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
)
