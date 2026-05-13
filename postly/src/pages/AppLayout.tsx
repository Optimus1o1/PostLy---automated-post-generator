import { Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'
import { useEffect } from 'react'

export function AppLayout() {
  const { user, ready, signOut } = useAuth()
  const navigate = useNavigate()

  // Auth guard — wait for session hydration, then redirect if no user
  useEffect(() => {
    if (ready && !user) {
      navigate({ to: '/login' })
    }
  }, [ready, user, navigate])

  // Show loading while session is hydrating
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 bg-[#FF7A45] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <p className="text-[#888]">Loading Postly...</p>
        </div>
      </div>
    )
  }

  if (!user) return null // Will redirect via useEffect

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  const navLinks = [
    { to: '/app', label: 'Dashboard', exact: true },
    { to: '/app/generate', label: 'Generate' },
    { to: '/app/calendars', label: 'Calendars' },
    { to: '/app/brands', label: 'Brands' },
    { to: '/app/account', label: 'Account' },
  ]

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF7A45] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-[#1A1A1A]">Postly</span>
          </Link>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                activeOptions={{ exact: link.exact }}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-[#888] hover:text-[#1A1A1A] hover:bg-gray-50 data-[status=active]:text-[#FF7A45] data-[status=active]:bg-orange-50">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#888] hidden md:block">{user.email}</span>
            <button onClick={handleSignOut} className="text-sm text-red-400 hover:text-red-600 font-medium">Sign out</button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
