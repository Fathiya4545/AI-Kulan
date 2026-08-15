import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.jsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL

// Without a deployment URL the whole app would render a blank white page, which
// is a miserable thing to debug. Say what's wrong instead.
function MissingConvexUrl() {
  return (
    <div className="setup-notice">
      <h1>Kulan isn't connected to a database yet</h1>
      <p>
        The <code>VITE_CONVEX_URL</code> environment variable is missing, so the app
        has nowhere to read events from.
      </p>
      <p>To fix it, run this in your project folder:</p>
      <pre>npm install{'\n'}npx convex dev</pre>
      <p>
        The first time you run <code>npx convex dev</code> it opens your browser to
        create a free Convex account and a database. It then writes{' '}
        <code>.env.local</code> with the URL this app needs. Leave that command
        running in its own terminal tab, and start the site with{' '}
        <code>npm run dev</code> in a second tab.
      </p>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))

if (!convexUrl) {
  root.render(
    <StrictMode>
      <MissingConvexUrl />
    </StrictMode>
  )
} else {
  const convex = new ConvexReactClient(convexUrl)

  root.render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProvider>
    </StrictMode>
  )
}
