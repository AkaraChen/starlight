import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { client } from './hooks/request'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
