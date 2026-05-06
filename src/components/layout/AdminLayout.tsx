import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguageStore } from '@/store/languageStore'
import { Button } from '@/components/ui/Button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { lang, setLang } = useLanguageStore()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const toggleLanguage = () => {
    setLang(lang === 'pt' ? 'en' : 'pt')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-dark-text/10 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-accent">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="h-9 w-9 rounded-lg bg-dark-bg hover:bg-dark-text/10 flex items-center justify-center text-sm font-medium text-accent transition-colors"
            >
              {lang.toUpperCase()}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
