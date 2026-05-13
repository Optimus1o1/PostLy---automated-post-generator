import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, Link } from "@tanstack/react-router"

interface AuthPageProps {
  mode?: 'login' | 'signup'
}

export function AuthPage({ mode = 'login' }: AuthPageProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const isSignUp = mode === 'signup'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }, // Store name in user metadata
          }
        })
        if (error) throw error
        toast({
          title: "Account created! 🎉",
          description: "You can now sign in and start generating content.",
        })
        // Auto-login after signup
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (!loginError) {
          navigate({ to: '/app', replace: true })
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast({
          title: "Welcome back! 👋",
          description: "Redirecting to your dashboard...",
        })
        navigate({ to: '/app', replace: true })
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Google Auth Error",
        description: error.message + " — Make sure Google OAuth is enabled in your Supabase Dashboard under Authentication > Providers > Google.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF7A45] to-[#FF5722] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200/50">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-[#888] mt-2">
            {isSignUp ? 'Start generating content calendars in minutes.' : 'Sign in to continue to Postly.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {/* Google OAuth */}
          <Button onClick={handleGoogleAuth} variant="outline" type="button" className="w-full py-5 rounded-xl font-medium border-gray-200 mb-6 text-[#1A1A1A] hover:bg-gray-50">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-[#888]">or continue with email</span></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name — only on signup */}
            {isSignUp && (
              <div>
                <Label htmlFor="fullName" className="mb-2 block text-sm font-medium">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Aniket Sharma" required className="py-5 rounded-xl" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="mb-2 block text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="py-5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2 block text-sm font-medium">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="py-5 rounded-xl" />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#FF7A45] to-[#FF5722] hover:from-[#E66A35] hover:to-[#E64A19] text-white py-5 rounded-xl text-base font-medium mt-2 glow-orange transition-all duration-300">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Please wait...
                </span>
              ) : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Toggle login/signup */}
        <p className="text-center mt-6 text-sm text-[#888]">
          {isSignUp ? (
            <>Already have an account? <Link to="/login" className="text-[#FF7A45] font-medium hover:underline">Sign in</Link></>
          ) : (
            <>Don't have an account? <Link to="/signup" className="text-[#FF7A45] font-medium hover:underline">Create one</Link></>
          )}
        </p>

        {/* Google Auth Help Note */}
        <p className="text-center mt-3 text-xs text-[#bbb]">
          Google Sign-in requires OAuth to be configured in your Supabase dashboard.
        </p>
      </div>
    </div>
  )
}
