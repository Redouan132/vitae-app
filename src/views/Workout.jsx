// =============================================
// views/Workout.jsx — Registro de entrenamientos
// =============================================

import { useState } from 'react'
import styles from './Workout.module.css'

const WORKOUT_TYPES = [
  { id: 'strength', icon: '🏋️', title: 'Fuerza',       desc: 'Pesas · Máquinas',        bg: 'var(--card-alt)',  border: 'var(--border)'          },
  { id: 'cardio',   icon: '🏃', title: 'Cardio',        desc: 'Correr · Ciclismo',       bg: '#1a1f2e',          border: 'rgba(100,120,200,0.2)'  },
  { id: 'yoga',     icon: '🧘', title: 'Yoga & Flex',   desc: 'Movilidad · Stretching',  bg: '#201a2e',          border: 'rgba(180,100,200,0.2)'  },
  { id: 'hiit',     icon: '⚡', title: 'HIIT',           desc: 'Circuitos · Alta intensidad', bg: '#1a2620',       border: 'var(--border-sage)'     },
]

const RECENT_WORKOUTS = [
  { icon: '🏋️', name: 'Fuerza — Tren superior', when: 'Hace 1 día',  duration: '48 min',  kcal: 320 },
  { icon: '🏃', name: 'Carrera matutina',         when: 'Hace 2 días', duration: '35 min · 5.2 km', kcal: 290 },
  { icon: '🧘', name: 'Yoga restaurativo',         when: 'Hace 3 días', duration: '50 min',  kcal: 120 },
  { icon: '⚡', name: 'HIIT metabólico',           when: 'Hace 5 días', duration: '25 min',  kcal: 410 },
]

export default function WorkoutView({ openModal, showToast, isSubscribed }) {
  const [streak] = useState(12)

  const handleSelectWorkout = (type) => {
    if (!isSubscribed) { openModal(); return }
    showToast(`Abriendo ${type.title}...`)
  }

  return (
    <div className={styles.wrapper}>
      {/* Encabezado */}
      <div className={styles.header}>
        <div>
          <p className={styles.label}>Movimiento</p>
          <h2 className="serif">Elige tu entreno</h2>
        </div>
        <div className={styles.streakBadge}>🔥 {streak} días seguidos</div>
      </div>

      {/* Grid de tipos de entrenamiento */}
      <div className={styles.typeGrid}>
        {WORKOUT_TYPES.map(wt => (
          <button
            key={wt.id}
            className={styles.typeCard}
            style={{ background: wt.bg, borderColor: wt.border }}
            onClick={() => handleSelectWorkout(wt)}
          >
            <span className={styles.typeIcon}>{wt.icon}</span>
            <h3 className={`${styles.typeTitle} serif`}>{wt.title}</h3>
            <p className={styles.typeDesc}>{wt.desc}</p>
          </button>
        ))}
      </div>

      {/* Historial */}
      <div className={styles.sectionHeader}>
        <h3 className="serif">Historial reciente</h3>
      </div>

      <div className={styles.recentList}>
        {RECENT_WORKOUTS.map((w, i) => (
          <div key={i} className={styles.recentItem}>
            <div className={styles.recentIcon}>{w.icon}</div>
            <div className={styles.recentInfo}>
              <h4 className={styles.recentName}>{w.name}</h4>
              <p className={styles.recentMeta}>{w.when} · {w.duration}</p>
            </div>
            <div className={styles.recentKcal}>+{w.kcal} kcal</div>
          </div>
        ))}
      </div>

      <button className={styles.logBtn} onClick={() => isSubscribed ? showToast('Registrando entrenamiento...') : openModal()}>
        + Registrar nuevo entrenamiento
      </button>
    </div>
  )
}
