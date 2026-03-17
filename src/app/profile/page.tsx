'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Mail, Globe, Twitter, Linkedin, Loader2, Save, FileText, Briefcase } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      setProfile(data)
      setLoading(false)
    }
    
    fetchProfile()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setSuccess(false)

    const updates = {
      full_name: profile.full_name,
      headline: profile.headline,
      bio: profile.bio,
      website: profile.website,
      twitter: profile.twitter,
      linkedin: profile.linkedin,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)

    setSaving(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-2 pt-24 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          
          {/* Header Profile */}
          <div className="h-32 bg-primary-light w-full"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-surface-3 flex items-center justify-center text-4xl font-bold text-primary shadow-sm overflow-hidden z-10">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-secondary">{profile?.full_name}</h1>
                <p className="text-text-secondary">{profile?.email}</p>
                <div className="mt-2 inline-flex">
                  <span className="badge badge-gray px-3 py-1 text-sm bg-surface-2 border border-border">
                    {profile?.role === 'admin' ? 'مدير المنصة' : profile?.role === 'teacher' ? 'معلم' : 'طالب'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdate} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">المعلومات الشخصية</h3>
                  <Input 
                    label="الاسم الكامل"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    leftIcon={<User className="w-5 h-5 text-text-muted" />}
                  />
                  <Input 
                    label="المسمى / التخصص (اختياري)"
                    placeholder="مطور برمجيات، مهندس..."
                    value={profile?.headline || ''}
                    onChange={(e) => setProfile({...profile, headline: e.target.value})}
                    leftIcon={<Briefcase className="w-5 h-5 text-text-muted" />}
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary">نبذة شخصية</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-lg border border-border bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all resize-none h-32 text-sm"
                      placeholder="تحدث عن نفسك، مهاراتك، وخبراتك..."
                      value={profile?.bio || ''}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">الروابط والحسابات</h3>
                  <Input 
                    label="الموقع الشخصي"
                    placeholder="https://yourwebsite.com"
                    value={profile?.website || ''}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    leftIcon={<Globe className="w-5 h-5 text-text-muted" />}
                    dir="ltr"
                    className="text-left"
                  />
                  <Input 
                    label="تويتر / X"
                    placeholder="https://twitter.com/username"
                    value={profile?.twitter || ''}
                    onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                    leftIcon={<Twitter className="w-5 h-5 text-text-muted" />}
                    dir="ltr"
                    className="text-left"
                  />
                  <Input 
                    label="لينكد إن"
                    placeholder="https://linkedin.com/in/username"
                    value={profile?.linkedin || ''}
                    onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                    leftIcon={<Linkedin className="w-5 h-5 text-text-muted" />}
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between">
                {success ? (
                  <span className="text-success font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    تم حفظ التغييرات بنجاح
                  </span>
                ) : <div></div>}
                
                <Button type="submit" variant="primary" isLoading={saving}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
