import { login, signup } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">🤖 Social Media Agent</Link>
          </div>
        </div>
      </header>
      
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="form-container" style={{ width: '100%', maxWidth: '400px', margin: '0' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Welcome Back</h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '30px' }}>Sign in to manage your social media content.</p>
          
          <form>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input className="form-input" id="email" name="email" type="email" required />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-input" id="password" name="password" type="password" required />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
              <button formAction={login} className="btn btn-primary" style={{ width: '100%' }}>Log In</button>
              <button formAction={signup} className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Sign Up</button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
