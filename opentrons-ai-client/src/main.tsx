import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { GlobalStyle } from './atoms/GlobalStyle'
import { PromptProvider } from './organisms/PromptButton/PromptProvider'

import { i18n } from './i18n'
import { App } from './App'

const rootElement = document.getElementById('root')
if (rootElement != null) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <GlobalStyle />
      <I18nextProvider i18n={i18n}>
        <PromptProvider>
          <App />
        </PromptProvider>
      </I18nextProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
