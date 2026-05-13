import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchCalendars } from "@/lib/api"
import { Link } from "@tanstack/react-router"

export function CalendarsPage() {
  const [calendars, setCalendars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCalendars().then(setCalendars).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Your Calendars</h1>
          <p className="text-[#666] mt-1">All the content calendars you've generated.</p>
        </div>
        <Link to="/app/generate">
          <Button className="bg-[#FF7A45] hover:bg-[#E66A35] text-white px-6 py-5 rounded-xl">+ New Calendar</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : calendars.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-2xl p-16 text-center bg-gray-50/50">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">No calendars yet</h3>
          <p className="text-[#888] mb-6">Generate your first content calendar to get started.</p>
          <Link to="/app/generate">
            <Button className="bg-[#FF7A45] hover:bg-[#E66A35] text-white rounded-xl">Generate Now</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calendars.map(cal => (
            <Link key={cal.id} to={`/app/calendars/${cal.id}`}>
              <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all flex justify-between items-center cursor-pointer group">
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#FF7A45] transition-colors">{cal.title}</h3>
                  <p className="text-sm text-[#888] mt-1">{cal.platform} • {cal.number_of_days} days • starts {cal.start_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#FF7A45] text-white px-3 py-1 rounded-lg text-sm font-medium">{cal.status}</span>
                  <svg className="w-5 h-5 text-[#ccc] group-hover:text-[#FF7A45] transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
