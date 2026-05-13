import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { fetchDashboard } from "@/lib/api"
import { Link } from "@tanstack/react-router"

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
        </h1>
        <p className="text-[#666] mt-1">Here's what's happening with your content.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <p className="text-sm text-[#888] font-medium mb-1">Calendars</p>
          <p className="text-3xl font-bold text-[#1A1A1A]">{stats?.totalCalendars || 0}</p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <p className="text-sm text-[#888] font-medium mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-[#1A1A1A]">{stats?.totalPosts || 0}</p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <p className="text-sm text-[#888] font-medium mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{stats?.approvedPosts || 0}</p>
        </div>
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <p className="text-sm text-[#888] font-medium mb-1">Plan</p>
          <p className="text-3xl font-bold text-[#FF7A45] capitalize">{stats?.planType || 'free'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-10">
        <Link to="/app/generate">
          <Button className="bg-[#FF7A45] hover:bg-[#E66A35] text-white px-6 py-5 rounded-xl text-base font-medium">
            + Generate New Calendar
          </Button>
        </Link>
        <Link to="/app/brands">
          <Button variant="outline" className="px-6 py-5 rounded-xl text-base font-medium border-gray-200">
            Manage Brands
          </Button>
        </Link>
      </div>

      {/* Recent Calendars */}
      <div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Recent Calendars</h2>
        {stats?.recentCalendars?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentCalendars.map((cal: any) => (
              <Link key={cal.id} to={`/app/calendars/${cal.id}`}>
                <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex justify-between items-center cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{cal.title}</h3>
                    <p className="text-sm text-[#888] mt-1">{cal.platform} • {cal.number_of_days} days • {cal.start_date}</p>
                  </div>
                  <div className="bg-[#FF7A45] text-white px-3 py-1 rounded-lg text-sm font-medium">{cal.status}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50/50">
            <p className="text-[#888]">No calendars yet. Generate your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
