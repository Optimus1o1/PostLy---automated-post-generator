import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateCalendar, fetchBrands } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "@tanstack/react-router"

const PLATFORMS = [
  { id: 'Instagram', icon: '📸', desc: 'Reels, carousels, stories & static posts', charLimit: 2200 },
  { id: 'LinkedIn', icon: '💼', desc: 'Professional thought-leadership posts', charLimit: 3000 },
  { id: 'Twitter / X', icon: '𝕏', desc: 'Short-form tweets & threads', charLimit: 280 },
  { id: 'Facebook', icon: '📘', desc: 'Community engagement & long-form', charLimit: 63206 },
]

const POST_TYPES: Record<string, string[]> = {
  'Instagram': ['Static Image', 'Carousel', 'Reel', 'Story', 'Mix of all'],
  'LinkedIn': ['Text post', 'Image post', 'Article snippet', 'Poll idea', 'Mix of all'],
  'Twitter / X': ['Tweet', 'Thread', 'Quote tweet idea', 'Mix of all'],
  'Facebook': ['Image post', 'Text post', 'Video idea', 'Event post', 'Mix of all'],
}

const TONES = ['Professional', 'Friendly & casual', 'Humorous & witty', 'Educational', 'Inspirational', 'Bold & edgy']
const FREQUENCIES = ['Daily', '5x per week', '3x per week', '2x per week']

export function GeneratePage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState("")
  const [step, setStep] = useState(1) // 1: persona+platform, 2: brand details, 3: calendar settings

  const [formData, setFormData] = useState({
    businessName: "",
    niche: "",
    targetAudience: "",
    brandVoice: "Friendly & casual",
    platform: "",
    frequency: "Daily",
    startDate: new Date().toISOString().split('T')[0],
    numberOfDays: "30",
    persona: "",
    campaignFocus: "",
    preferredPostTypes: "Mix of all",
    includeHashtags: true,
    includeCTA: true,
    includeImageIdeas: true,
    language: "English + Hinglish mix",
    festivalThemes: true,
  })

  useEffect(() => {
    fetchBrands().then(setBrands).catch(() => {})
  }, [])

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrandId(brandId)
    if (brandId) {
      const brand = brands.find(b => b.id === brandId)
      if (brand) {
        setFormData(prev => ({
          ...prev,
          businessName: brand.business_name,
          niche: brand.niche || '',
          targetAudience: brand.target_audience || '',
          brandVoice: brand.brand_voice || 'Friendly & casual',
          persona: brand.persona_type || 'Business'
        }))
      }
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...formData, brandId: selectedBrandId || undefined }
      const data = await generateCalendar(payload)
      toast({ title: "Calendar generated! 🎉", description: "Redirecting to your new calendar..." })
      navigate({ to: `/app/calendars/${data.calendarId}` })
    } catch (error: any) {
      console.error(error)
      toast({ title: "Generation Failed", description: error.message || "Something went wrong.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const selectClass = "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A45]/30"

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1">Create a content calendar</h1>
      <p className="text-[#666] mb-8">Our AI will generate optimized posts tailored for your platform and audience.</p>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-gradient-to-br from-[#FF7A45] to-[#FF5722] text-white shadow-md' : 'bg-gray-100 text-[#888]'}`}>{s}</div>
            <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-[#1A1A1A]' : 'text-[#ccc]'}`}>
              {s === 1 ? 'Platform' : s === 2 ? 'Brand' : 'Settings'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-[#FF7A45]' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleGenerate}>
        {/* ═══ STEP 1: Persona + Platform Selection ═══ */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fade-up">
            <h3 className="font-bold text-xl mb-6 text-[#1A1A1A]">What are you creating for?</h3>

            {/* Persona */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Business', 'Creator / Personal Brand'].map(p => (
                <button key={p} type="button" onClick={() => setFormData({...formData, persona: p})}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.persona === p ? 'border-[#FF7A45] bg-orange-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                  <span className="text-2xl mb-2 block">{p === 'Business' ? '🏪' : '🎨'}</span>
                  <span className="font-semibold text-[#1A1A1A]">{p}</span>
                  <p className="text-xs text-[#888] mt-1">{p === 'Business' ? 'Company, shop, agency, restaurant' : 'Individual, influencer, freelancer'}</p>
                </button>
              ))}
            </div>

            {/* Platform */}
            <h3 className="font-bold text-lg mb-4 text-[#1A1A1A]">Which platform?</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PLATFORMS.map(pl => (
                <button key={pl.id} type="button" onClick={() => setFormData({...formData, platform: pl.id})}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.platform === pl.id ? 'border-[#FF7A45] bg-orange-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                  <span className="text-xl">{pl.icon}</span>
                  <span className="font-semibold text-[#1A1A1A] ml-2">{pl.id}</span>
                  <p className="text-xs text-[#888] mt-1">{pl.desc}</p>
                </button>
              ))}
            </div>

            <Button type="button" disabled={!formData.persona || !formData.platform}
              onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-[#FF7A45] to-[#FF5722] text-white py-5 rounded-xl font-medium glow-orange transition-all">
              Continue →
            </Button>
          </div>
        )}

        {/* ═══ STEP 2: Brand Details ═══ */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fade-up">
            <h3 className="font-bold text-xl mb-6 text-[#1A1A1A]">Tell us about your brand</h3>

            {/* Brand quick-fill */}
            {brands.length > 0 && (
              <div className="mb-6 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                <Label className="mb-2 block font-semibold text-sm">Quick fill from saved brand</Label>
                <select className={selectClass} value={selectedBrandId} onChange={e => handleBrandSelect(e.target.value)}>
                  <option value="">— Select or fill manually below —</option>
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{b.business_name}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <Label className="mb-2 block text-sm font-medium">Name *</Label>
                <Input placeholder={formData.persona === 'Business' ? 'e.g. Aroma Cafe' : 'e.g. Aniket Sharma'} value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} required className="rounded-xl py-5" />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Niche / Industry *</Label>
                <Input placeholder="e.g. Specialty coffee shop in Pune" value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} required className="rounded-xl py-5" />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Target Audience *</Label>
                <Input placeholder="e.g. Young professionals aged 22-35, coffee lovers" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} required className="rounded-xl py-5" />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Brand Voice / Tone</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map(t => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, brandVoice: t})}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.brandVoice === t ? 'bg-[#FF7A45] text-white shadow-sm' : 'bg-gray-50 text-[#666] hover:bg-gray-100'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="py-5 rounded-xl">← Back</Button>
              <Button type="button" disabled={!formData.businessName || !formData.niche || !formData.targetAudience}
                onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-[#FF7A45] to-[#FF5722] text-white py-5 rounded-xl font-medium glow-orange">
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Calendar Settings (Platform-specific) ═══ */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-fade-up">
            <h3 className="font-bold text-xl mb-2 text-[#1A1A1A]">Calendar settings for {formData.platform}</h3>
            <p className="text-sm text-[#888] mb-6">Customize your {formData.platform} calendar for maximum engagement.</p>

            <div className="space-y-5 mb-8">
              {/* Post Types — platform specific */}
              <div>
                <Label className="mb-2 block text-sm font-medium">Preferred post types</Label>
                <div className="flex flex-wrap gap-2">
                  {(POST_TYPES[formData.platform] || POST_TYPES['Instagram']).map(pt => (
                    <button key={pt} type="button" onClick={() => setFormData({...formData, preferredPostTypes: pt})}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.preferredPostTypes === pt ? 'bg-[#FF7A45] text-white' : 'bg-gray-50 text-[#666] hover:bg-gray-100'}`}>
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">Frequency</Label>
                  <select className={selectClass} value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                    {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Duration</Label>
                  <select className={selectClass} value={formData.numberOfDays} onChange={e => setFormData({...formData, numberOfDays: e.target.value})}>
                    <option value="7">7 days (free sample)</option>
                    <option value="15">15 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Start date</Label>
                  <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required className="rounded-xl" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Language style</Label>
                  <select className={selectClass} value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                    <option>English + Hinglish mix</option>
                    <option>Pure English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Tamil</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">Campaign focus (optional)</Label>
                <Input placeholder="e.g. Monsoon sale, Diwali collection, Product launch" value={formData.campaignFocus} onChange={e => setFormData({...formData, campaignFocus: e.target.value})} className="rounded-xl py-5" />
              </div>

              {/* Content options */}
              <div>
                <Label className="mb-3 block text-sm font-medium">Include in generated posts</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'includeHashtags', label: '# Hashtags' },
                    { key: 'includeCTA', label: '📢 Call-to-action' },
                    { key: 'includeImageIdeas', label: '🎨 Image ideas' },
                    { key: 'festivalThemes', label: '🪔 Indian festivals' },
                  ].map(opt => (
                    <button key={opt.key} type="button"
                      onClick={() => setFormData({...formData, [opt.key]: !(formData as any)[opt.key]})}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${(formData as any)[opt.key] ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-[#999]'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="py-5 rounded-xl">← Back</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#FF7A45] to-[#FF5722] text-white py-6 rounded-xl text-lg font-semibold glow-orange transition-all duration-300 hover:-translate-y-0.5">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Generating your {formData.numberOfDays}-day calendar...
                  </span>
                ) : `🚀 Generate ${formData.numberOfDays}-Day ${formData.platform} Calendar`}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
