import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { fetchCalendar, approvePost, updatePost, regeneratePost } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Link } from "@tanstack/react-router"

type ViewMode = 'grid' | 'calendar' | 'list'
type FilterMode = 'all' | 'draft' | 'approved'

export function CalendarDetailPage({ calendarId }: { calendarId: string }) {
  const { toast } = useToast()
  const [calendar, setCalendar] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState("")
  const [editHashtags, setEditHashtags] = useState("")
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)

  const load = () => {
    fetchCalendar(calendarId)
      .then(data => {
        setCalendar(data)
        setPosts(data.posts || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [calendarId])

  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts
    return posts.filter(p => p.status === filter)
  }, [posts, filter])

  const approvedCount = posts.filter(p => p.status === 'approved').length

  // ── Actions ──
  const handleApprove = async (postId: string, current: string) => {
    const newApproved = current !== 'approved'
    try {
      const updated = await approvePost(postId, newApproved)
      setPosts(prev => prev.map(p => p.id === postId ? updated : p))
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  const handleBulkApprove = async () => {
    const drafts = posts.filter(p => p.status === 'draft')
    for (const post of drafts) {
      try {
        const updated = await approvePost(post.id, true)
        setPosts(prev => prev.map(p => p.id === post.id ? updated : p))
      } catch {}
    }
    toast({ title: "All posts approved! ✅" })
  }

  const handleCopy = (caption: string) => {
    navigator.clipboard.writeText(caption)
    toast({ title: "Copied to clipboard! 📋" })
  }

  const handleStartEdit = (post: any) => {
    setEditingPost(post.id)
    setEditCaption(post.caption)
    setEditHashtags((post.hashtags || []).join(', '))
  }

  const handleSaveEdit = async (postId: string) => {
    try {
      const hashtags = editHashtags.split(',').map(h => h.trim()).filter(Boolean)
      const updated = await updatePost(postId, { caption: editCaption, hashtags })
      setPosts(prev => prev.map(p => p.id === postId ? updated : p))
      setEditingPost(null)
      toast({ title: "Post updated! ✏️" })
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  const handleRegenerate = async (postId: string) => {
    setRegeneratingId(postId)
    try {
      const updated = await regeneratePost(postId)
      setPosts(prev => prev.map(p => p.id === postId ? updated : p))
      toast({ title: "Post regenerated! 🔄" })
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setRegeneratingId(null)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Caption', 'Hashtags', 'Image Idea', 'Status']
    const rows = posts.map(p => [
      p.post_date, p.post_type, `"${(p.caption || '').replace(/"/g, '""')}"`,
      (p.hashtags || []).join(' '), `"${(p.image_idea || '').replace(/"/g, '""')}"`, p.status
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${calendar?.title || 'calendar'}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast({ title: "CSV exported! 📥" })
  }

  if (loading) {
    return (
      <div className="max-w-6xl animate-pulse">
        <div className="h-8 bg-muted rounded w-96 mb-4" />
        <div className="h-4 bg-muted rounded w-64 mb-8" />
        <div className="grid grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-muted rounded-2xl" />)}</div>
      </div>
    )
  }

  if (!calendar) return <div className="text-center py-20 text-[#888]">Calendar not found.</div>

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/app/calendars" className="text-sm text-[#888] hover:text-[#FF7A45] mb-2 inline-block">← Back to calendars</Link>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">{calendar.title}</h1>
        <p className="text-[#666] mt-1">{calendar.platform} • {calendar.number_of_days} days • starts {calendar.start_date}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-100 rounded-xl p-4 bg-white text-center">
          <p className="text-2xl font-bold text-[#1A1A1A]">{posts.length}</p>
          <p className="text-xs text-[#888]">Total Posts</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 bg-white text-center">
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-xs text-[#888]">Approved</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 bg-white text-center">
          <p className="text-2xl font-bold text-[#FF7A45]">{posts.length - approvedCount}</p>
          <p className="text-xs text-[#888]">Pending</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        {/* View Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(['grid', 'calendar', 'list'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${view === v ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#888] hover:text-[#1A1A1A]'}`}>
              {v}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'draft', 'approved'] as FilterMode[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? 'bg-[#FF7A45] text-white' : 'bg-gray-100 text-[#888] hover:text-[#1A1A1A]'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <Button onClick={handleBulkApprove} variant="outline" size="sm" className="rounded-lg text-xs">✅ Approve All</Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="rounded-lg text-xs">📥 Export CSV</Button>
        </div>
      </div>

      {/* ── GRID VIEW ── */}
      {view === 'grid' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Date & Type Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-[#FF7A45]">{post.post_date}</span>
                <span className="text-xs bg-gray-100 text-[#666] px-2 py-1 rounded-full">{post.post_type}</span>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {post.status}
                </span>
              </div>

              {/* Caption */}
              {editingPost === post.id ? (
                <div className="flex-1 space-y-2 mb-3">
                  <textarea className="w-full border rounded-lg p-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#FF7A45]" value={editCaption} onChange={e => setEditCaption(e.target.value)} />
                  <input className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A45]" value={editHashtags} onChange={e => setEditHashtags(e.target.value)} placeholder="Hashtags (comma separated)" />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveEdit(post.id)} size="sm" className="bg-[#FF7A45] hover:bg-[#E66A35] text-white text-xs rounded-lg">Save</Button>
                    <Button onClick={() => setEditingPost(null)} variant="outline" size="sm" className="text-xs rounded-lg">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#1A1A1A] mb-2 flex-1 line-clamp-4">{post.caption}</p>
                  <p className="text-xs text-blue-500 mb-3">{(post.hashtags || []).join(' ')}</p>
                </>
              )}

              {/* Image Idea */}
              {post.image_idea && (
                <div className="bg-orange-50 p-3 rounded-lg text-xs text-[#666] mb-3 border border-orange-100">
                  <span className="font-medium text-[#1A1A1A]">Visual: </span>{post.image_idea}
                </div>
              )}

              {/* Actions */}
              {editingPost !== post.id && (
                <div className="flex gap-1.5 pt-3 border-t border-gray-50 flex-wrap">
                  <button onClick={() => handleApprove(post.id, post.status)} className="text-xs px-2 py-1 rounded-md bg-gray-50 hover:bg-green-50 text-[#666] hover:text-green-600 transition-colors">
                    {post.status === 'approved' ? '↩ Unapprove' : '✅ Approve'}
                  </button>
                  <button onClick={() => handleCopy(post.caption)} className="text-xs px-2 py-1 rounded-md bg-gray-50 hover:bg-blue-50 text-[#666] hover:text-blue-600 transition-colors">📋 Copy</button>
                  <button onClick={() => handleStartEdit(post)} className="text-xs px-2 py-1 rounded-md bg-gray-50 hover:bg-orange-50 text-[#666] hover:text-[#FF7A45] transition-colors">✏️ Edit</button>
                  <button onClick={() => handleRegenerate(post.id)} disabled={regeneratingId === post.id} className="text-xs px-2 py-1 rounded-md bg-gray-50 hover:bg-purple-50 text-[#666] hover:text-purple-600 transition-colors disabled:opacity-50">
                    {regeneratingId === post.id ? '⏳' : '🔄'} Regen
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CALENDAR (MONTHLY) VIEW ── */}
      {view === 'calendar' && <MonthlyCalendarView posts={filteredPosts} />}

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[#888]">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Caption</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-[#FF7A45] whitespace-nowrap">{post.post_date}</td>
                  <td className="p-4 text-[#666]">{post.post_type}</td>
                  <td className="p-4 text-[#1A1A1A] max-w-md truncate">{post.caption}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${post.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => handleApprove(post.id, post.status)} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-green-100 text-[#666]">
                        {post.status === 'approved' ? '↩' : '✅'}
                      </button>
                      <button onClick={() => handleCopy(post.caption)} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-blue-100 text-[#666]">📋</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Monthly Calendar Grid Sub-Component ──
function MonthlyCalendarView({ posts }: { posts: any[] }) {
  const postsByDate = useMemo(() => {
    const map: Record<string, any[]> = {}
    posts.forEach(p => {
      if (!map[p.post_date]) map[p.post_date] = []
      map[p.post_date].push(p)
    })
    return map
  }, [posts])

  // Build a month grid from the first post's date
  const firstDate = posts[0]?.post_date ? new Date(posts[0].post_date) : new Date()
  const year = firstDate.getFullYear()
  const month = firstDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = firstDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-[#888] py-2">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="p-2 min-h-[80px]" />
          const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const dayPosts = postsByDate[dateStr] || []
          return (
            <div key={dateStr} className={`p-2 min-h-[80px] border border-gray-50 rounded-lg ${dayPosts.length > 0 ? 'bg-orange-50/50' : 'bg-white'}`}>
              <div className="text-xs font-medium text-[#1A1A1A] mb-1">{day}</div>
              {dayPosts.map((p: any) => (
                <div key={p.id} className={`text-xs px-1.5 py-0.5 rounded mb-0.5 truncate ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-[#FF7A45]/10 text-[#FF7A45]'}`}>
                  {p.post_type}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
