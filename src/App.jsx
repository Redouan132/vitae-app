import { useState, useEffect } from 'react'
import { supabase }        from './lib/supabase'
import { useAuth }         from './hooks/useAuth'
import Nav                 from './components/Nav'
import Toast               from './components/Toast'
import SubscriptionModal   from './components/SubscriptionModal'
import AuthView            from './views/Auth'
import ProfileSetupView    from './views/ProfileSetup'
import HomeView            from './views/Home'
import NutritionView       from './views/Nutrition'
import WorkoutView         from './views/Workout'
import ProgressView        from './views/Progress'

export default function App() {
  const { user, loading }  = useAuth()
  const [activeView,        setActiveView]        = useState('home')
  const [modalOpen,         setModalOpen]         = useState(false)
  const [toast,             setToast]             = useState({ visible: false, message: '' })
  const [isSubscribed,      setIsSubscribed]      = useState(false)
  const [profileComplete,   setProfileComplete]   = useState(null)
  const [userGoals,         setUserGoals]         = useState(null)

  const showToast = (msg) => {
    setToast({ visible: true, message: msg })
    setTimeout(() => setToast({ visible: false, message: '' }), 2800)
  }

  useEffect(() => {
    if (!user) { setProfileComplete(null); return }
    supabase.from('profiles')
      .select('onboarding_done, goal_kcal, goal_prot, goal_carbs, goal_fat, goal, weight_kg')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.onboarding_done) {
          setProfileComplete(true)
          setUserGoals({ target: data.goal_kcal, prot: data.goal_prot, carbs: data.goal_carbs, fat: data.goal_fat, goal: data.goal, weight: data.weight_kg })
        } else {
          setProfileComplete(false)
        }
      })
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setActiveView('home')
    setProfileComplete(null)
    setUserGoals(null)
    showToast('Hasta pronto 👋')
  }

  const handleSubscribe = () => {
    setIsSubscribed(true)
    setModalOpen(false)
    showToast('¡Bienvenido/a a Vitae Premium! 🌿')
  }

  const handleProfileComplete = (macros) => {
    setUserGoals(macros)
    setProfileComplete(true)
    showToast('¡Perfil creado! Bienvenido/a a Vitae 🌿')
  }

  const viewProps = { openModal: () => setModalOpen(true), showToast, isSubscribed, user, userGoals }

  if (loading || (user && profileComplete === null)) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:'1rem', background:'#f4f9f5' }}>
        <div style={{ fontFamily:'Poppins,sans-serif', fontSize:'28px', letterSpacing:'4px', color:'#1a7a4a', fontWeight:700 }}>
          VI<span style={{color:'#34c472'}}>TAE</span>
        </div>
        <p style={{ color:'#6b8c78', fontSize:'13px', fontWeight:500 }}>Cargando...</p>
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

  if (!profileComplete) {
    return (
      <>
        <ProfileSetupView user={user} onComplete={handleProfileComplete} />
        <Toast visible={toast.visible} message={toast.message} />
      </>
    )
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':      return <HomeView      {...viewProps} goToView={setActiveView} />
      case 'nutrition': return <NutritionView {...viewProps} />
      case 'workout':   return <WorkoutView   {...viewProps} />
      case 'progress':  return <ProgressView  {...viewProps} />
      default:          return <HomeView      {...viewProps} goToView={setActiveView} />
    }
  }

  return (
    <div className="app-layout">
      <Nav activeView={activeView} onChangeView={setActiveView} onOpenModal={() => setModalOpen(true)} isSubscribed={isSubscribed} user={user} onLogout={handleLogout} />
      <main className="main-content fade-in" key={activeView}>{renderView()}</main>
      <SubscriptionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubscribe={handleSubscribe} />
      <Toast visible={toast.visible} message={toast.message} />
    </div>
  )
}