// App.jsx — v2 con autenticación y Open Food Facts

import { useState } from 'react'
import { supabase }           from './lib/supabase'
import { useAuth }            from './hooks/useAuth'

import Nav                    from './components/Nav'
import Toast                  from './components/Toast'
import SubscriptionModal      from './components/SubscriptionModal'

import AuthView               from './views/Auth'
import HomeView               from './views/Home'
import NutritionView          from './views/Nutrition'
import WorkoutView            from './views/Workout'
import ProgressView           from './views/Progress'

export default function App() {
  const { user, loading } = useAuth()

  const [activeView,   setActiveView]   = useState('home')
  const [modalOpen,    setModalOpen]    = useState(false)
  const [toast,        setToast]        = useState({ visible: false, message: '' })
  const [isSubscribed, setIsSubscribed] = useState(false)

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2800)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setActiveView('home')
    showToast('Hasta pronto 👋')
  }

  const handleSubscribe = () => {
    // TODO: conectar Stripe aquí
    setIsSubscribed(true)
    setModalOpen(false)
    showToast('¡Bienvenido/a a Vitae Premium! 🌿')
  }

  const viewProps = { openModal: () => setModalOpen(true), showToast, isSubscribed, user }

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:'1rem' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', letterSpacing:'4px', color:'#c9a96e' }}>
          VI<em style={{color:'#f0ece1',fontStyle:'italic'}}>TAE</em>
        </div>
        <p style={{ color:'#8aab96', fontSize:'13px' }}>Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthView showToast={showToast} />
        <Toast visible={toast.visible} message={toast.message} />
      </>
    )
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':       return <HomeView      {...viewProps} goToView={setActiveView} />
      case 'nutrition':  return <NutritionView {...viewProps} />
      case 'workout':    return <WorkoutView   {...viewProps} />
      case 'progress':   return <ProgressView  {...viewProps} />
      default:           return <HomeView      {...viewProps} goToView={setActiveView} />
    }
  }

  return (
    <div className="app-layout">
      <Nav
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenModal={() => setModalOpen(true)}
        isSubscribed={isSubscribed}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content fade-in" key={activeView}>
        {renderView()}
      </main>
      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
      <Toast visible={toast.visible} message={toast.message} />
    </div>
  )
}
