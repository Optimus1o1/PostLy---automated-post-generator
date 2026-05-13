import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"

export function AccountPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Account</h1>
      <p className="text-[#666] mb-8">Manage your profile and subscription.</p>

      <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm space-y-6">
        <div>
          <p className="text-sm text-[#888] font-medium mb-1">Email</p>
          <p className="text-lg font-semibold text-[#1A1A1A]">{user?.email || 'Not logged in'}</p>
        </div>

        <div>
          <p className="text-sm text-[#888] font-medium mb-1">User ID</p>
          <p className="text-sm text-[#666] font-mono">{user?.id || '—'}</p>
        </div>

        <div>
          <p className="text-sm text-[#888] font-medium mb-1">Plan</p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-[#FF7A45] capitalize">Free</span>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">Upgrade</Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Button onClick={handleSignOut} variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
