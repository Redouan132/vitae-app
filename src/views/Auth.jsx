// =============================================
// views/Auth.jsx — Pantallas de Login y Registro
//
// Usa Supabase Auth con email + contraseña.
// También podrías añadir Google OAuth fácilmente:
//   supabase.auth.signInWithOAuth({ provider: 'google' })
// =============================================

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Auth.module.css'

export default function AuthView({ showToast }) {
  // 'login' | 'register' | 'forgot'
  const [mode, setMode]         = useState('login')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  // Campos del formulario
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')

  const reset = () => { setError(''); setSuccess('') }

  // ── LOGIN ──────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    reset()
    if (!email || !password) { setError('Rellena todos los campos.'); return }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      // Traduce los errores más comunes de Supabase al español
      if (error.message.includes('Invalid login'))
        setError('Email o contraseña incorrectos.')
      else if (error.message.includes('Email not confirmed'))
        setError('Confirma tu email antes de entrar. Revisa tu bandeja de entrada.')
      else
        setError(error.message)
    }
    // Si hay éxito, useAuth detecta el cambio de sesión y App.jsx redirige automáticamente
  }

  // ── REGISTRO ───────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    reset()
    if (!name || !email || !password || !confirm) { setError('Rellena todos los campos.'); return }
    if (password.length < 6)  { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },  // se guarda en raw_user_meta_data y el trigger lo pasa a profiles
      },
    })
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered'))
        setError('Este email ya tiene una cuenta. Inicia sesión.')
      else
        setError(error.message)
    } else {
      setSuccess('¡Cuenta creada! Revisa tu email para confirmar tu dirección.')
    }
  }

  // ── RECUPERAR CONTRASEÑA ───────────────────
  const handleForgot = async (e) => {
    e.preventDefault()
    reset()
    if (!email) { setError('Introduce tu email.'); return }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    setLoading(false)

    if (error) setError(error.message)
    else setSuccess('Te hemos enviado un enlace para restablecer tu contraseña.')
  }

  return (
    <div className={styles.wrapper}>
      {/* Logo + tagline */}
      <div className={styles.logoBlock}>
        <div className={styles.logo}>vi<em>tae</em></div>
        <p className={styles.tagline}>Tu cuerpo, tu obra maestra.</p>
      </div>

      {/* Tarjeta de formulario */}
      <div className={styles.card}>

        {/* Tabs login / registro */}
        {mode !== 'forgot' && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${mode === 'login' ? styles.activeTab : ''}`}
              onClick={() => { setMode('login'); reset() }}
            >Entrar</button>
            <button
              className={`${styles.tabBtn} ${mode === 'register' ? styles.activeTab : ''}`}
              onClick={() => { setMode('register'); reset() }}
            >Crear cuenta</button>
          </div>
        )}

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className={styles.form} noValidate>
            <h2 className={styles.formTitle}>Bienvenido/a de vuelta</h2>

            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => { setMode('forgot'); reset() }}
            >¿Olvidaste tu contraseña?</button>

            {error   && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {/* ── REGISTRO ── */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className={styles.form} noValidate>
            <h2 className={styles.formTitle}>Empieza tu transformación</h2>

            <label className={styles.label}>Tu nombre</label>
            <input
              className={styles.input}
              type="text"
              placeholder="María García"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />

            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <label className={styles.label}>Confirmar contraseña</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Repite la contraseña"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />

            {error   && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

            <p className={styles.legalNote}>
              Al registrarte aceptas nuestros Términos de servicio y Política de privacidad.
            </p>
          </form>
        )}

        {/* ── RECUPERAR CONTRASEÑA ── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className={styles.form} noValidate>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => { setMode('login'); reset() }}
            >← Volver</button>

            <h2 className={styles.formTitle}>Restablecer contraseña</h2>
            <p className={styles.forgotDesc}>
              Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
            </p>

            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            {error   && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
      </div>

      {/* Separador visual con beneficios */}
      <div className={styles.benefits}>
        {['🌿 Nutrición inteligente', '🔥 Entrenamientos adaptados', '📈 Progreso visible'].map(b => (
          <span key={b} className={styles.benefit}>{b}</span>
        ))}
      </div>
    </div>
  )
}
