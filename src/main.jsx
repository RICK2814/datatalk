import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY — get it from clerk.com/dashboard')
}

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!PUBLISHABLE_KEY) {
  root.render(
    <div style={{fontFamily:"system-ui, sans-serif",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backgroundColor:"#070c14",color:"#e2e8f0"}}>
      <div style={{maxWidth:520, textAlign:"center"}}>
        <h1 style={{marginBottom:12}}>Missing VITE_CLERK_PUBLISHABLE_KEY</h1>
        <p style={{marginBottom:20,color:"#a0acc4"}}>
          Set <code style={{background:"#0c1220",padding:"2px 6px",borderRadius:4}}>VITE_CLERK_PUBLISHABLE_KEY</code> in <code style={{background:"#0c1220",padding:"2px 6px",borderRadius:4}}>.env.local</code> and restart the dev server.
        </p>
        <p style={{color:"#6a7b8f",fontSize:13}}>Get the key from <a href="https://clerk.com/dashboard" style={{color:"#6366f1"}} target="_blank" rel="noreferrer">clerk.com/dashboard</a>.</p>
      </div>
    </div>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
