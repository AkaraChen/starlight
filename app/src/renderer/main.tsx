import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app'
import './index.css'

window.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    if (history.length > 1) {
      history.back()
    } else {
      window.close()
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
