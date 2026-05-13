import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchBrands, createBrand, updateBrand, deleteBrand } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Brand {
  id: string
  persona_type: string
  business_name: string
  niche: string
  target_audience: string
  brand_voice: string
  default_platform: string
}

const emptyBrand = {
  persona_type: 'Business',
  business_name: '',
  niche: '',
  target_audience: '',
  brand_voice: 'Friendly and professional',
  default_platform: 'Instagram'
}

export function BrandsPage() {
  const { toast } = useToast()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [form, setForm] = useState(emptyBrand)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetchBrands().then(setBrands).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingBrand(null)
    setForm(emptyBrand)
    setShowModal(true)
  }

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setForm({
      persona_type: brand.persona_type,
      business_name: brand.business_name,
      niche: brand.niche || '',
      target_audience: brand.target_audience || '',
      brand_voice: brand.brand_voice || '',
      default_platform: brand.default_platform || 'Instagram'
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, form)
        toast({ title: "Brand updated!" })
      } else {
        await createBrand(form)
        toast({ title: "Brand created!" })
      }
      setShowModal(false)
      load()
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand profile?")) return
    try {
      await deleteBrand(id)
      toast({ title: "Brand deleted" })
      load()
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Brand Profiles</h1>
          <p className="text-[#666] mt-1">Save your brand once, reuse it for every campaign.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#FF7A45] hover:bg-[#E66A35] text-white px-6 py-5 rounded-xl">
          + New Brand
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : brands.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-2xl p-16 text-center bg-gray-50/50">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">No brand profiles yet</h3>
          <p className="text-[#888] mb-6">Create one to speed up your calendar generation.</p>
          <Button onClick={openCreate} className="bg-[#FF7A45] hover:bg-[#E66A35] text-white rounded-xl">Create Your First Brand</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A1A]">{brand.business_name}</h3>
                  <p className="text-sm text-[#888]">{brand.niche}</p>
                </div>
                <span className="text-xs bg-orange-100 text-[#FF7A45] px-2.5 py-1 rounded-full font-medium">{brand.persona_type}</span>
              </div>
              <div className="space-y-1 text-sm text-[#666] mb-4">
                <p><span className="font-medium text-[#1A1A1A]">Audience:</span> {brand.target_audience}</p>
                <p><span className="font-medium text-[#1A1A1A]">Voice:</span> {brand.brand_voice}</p>
                <p><span className="font-medium text-[#1A1A1A]">Platform:</span> {brand.default_platform}</p>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                <Button variant="outline" size="sm" onClick={() => openEdit(brand)} className="text-xs rounded-lg">Edit</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(brand.id)} className="text-xs rounded-lg text-red-500 hover:text-red-600">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">{editingBrand ? 'Edit Brand' : 'Create New Brand'}</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Profile Type</Label>
                <select className={selectClass} value={form.persona_type} onChange={e => setForm({...form, persona_type: e.target.value})}>
                  <option>Business</option>
                  <option>Creator / Personal Brand</option>
                </select>
              </div>
              <div>
                <Label className="mb-2 block">Business / Brand Name *</Label>
                <Input value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} placeholder="e.g. Aroma Cafe" required />
              </div>
              <div>
                <Label className="mb-2 block">Niche</Label>
                <Input value={form.niche} onChange={e => setForm({...form, niche: e.target.value})} placeholder="e.g. Specialty coffee shop in Pune" />
              </div>
              <div>
                <Label className="mb-2 block">Target Audience</Label>
                <Input value={form.target_audience} onChange={e => setForm({...form, target_audience: e.target.value})} placeholder="e.g. Young professionals 25-35" />
              </div>
              <div>
                <Label className="mb-2 block">Brand Voice</Label>
                <Input value={form.brand_voice} onChange={e => setForm({...form, brand_voice: e.target.value})} placeholder="e.g. Friendly, witty, educational" />
              </div>
              <div>
                <Label className="mb-2 block">Default Platform</Label>
                <select className={selectClass} value={form.default_platform} onChange={e => setForm({...form, default_platform: e.target.value})}>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Twitter / X</option>
                  <option>Facebook</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button onClick={handleSave} disabled={saving || !form.business_name} className="flex-1 bg-[#FF7A45] hover:bg-[#E66A35] text-white py-5 rounded-xl font-medium">
                {saving ? 'Saving...' : editingBrand ? 'Update Brand' : 'Create Brand'}
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)} className="py-5 rounded-xl">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
