import { useState } from 'react'
import styles from './Workout.module.css'

const WORKOUT_TYPES = [
  { id: 'strength', icon: '🏋️', title: 'Fuerza',      desc: 'Pesas · Máquinas',           bg: '#e8f5ed', border: '#1a7a4a' },
  { id: 'cardio',   icon: '🏃', title: 'Cardio',       desc: 'Correr · Ciclismo',           bg: '#e8f0ff', border: '#7c6adb' },
  { id: 'yoga',     icon: '🧘', title: 'Yoga & Flex',  desc: 'Movilidad · Stretching',      bg: '#fff0e8', border: '#e07a2a' },
  { id: 'hiit',     icon: '⚡', title: 'HIIT',          desc: 'Circuitos · Alta intensidad', bg: '#e8f9ff', border: '#2a9be0' },
]

const EJERCICIOS = {
  strength: [
    { nombre: 'Press de banca',  series: '4x10', descanso: '90s',  musculo: 'Pecho',   free: true  },
    { nombre: 'Sentadilla',      series: '4x12', descanso: '90s',  musculo: 'Piernas', free: true  },
    { nombre: 'Peso muerto',     series: '3x8',  descanso: '120s', musculo: 'Espalda', free: false },
    { nombre: 'Press militar',   series: '3x10', descanso: '60s',  musculo: 'Hombros', free: false },
    { nombre: 'Dominadas',       series: '3x8',  descanso: '90s',  musculo: 'Espalda', free: false },
    { nombre: 'Curl de bíceps',  series: '3x12', descanso: '60s',  musculo: 'Bíceps',  free: false },
  ],
  cardio: [
    { nombre: 'Carrera continua',   series: '30 min', descanso: '-',   musculo: 'Cardio', free: true  },
    { nombre: 'Bicicleta estática', series: '20 min', descanso: '-',   musculo: 'Cardio', free: true  },
    { nombre: 'Saltar a la comba',  series: '10 min', descanso: '60s', musculo: 'Cardio', free: false },
    { nombre: 'Remo',               series: '15 min', descanso: '-',   musculo: 'Cardio', free: false },
  ],
  yoga: [
    { nombre: 'Saludo al sol',    series: '5 rondas', descanso: '30s', musculo: 'Full body', free: true  },
    { nombre: 'Guerrero I y II',  series: '3x45s',    descanso: '30s', musculo: 'Piernas',   free: true  },
    { nombre: 'Perro boca abajo', series: '3x60s',    descanso: '30s', musculo: 'Espalda',   free: false },
    { nombre: 'Paloma',           series: '2x90s',    descanso: '30s', musculo: 'Cadera',    free: false },
  ],
  hiit: [
    { nombre: 'Burpees',              series: '4x20s', descanso: '10s', musculo: 'Full body', free: true  },
    { nombre: 'Mountain climbers',    series: '4x20s', descanso: '10s', musculo: 'Core',      free: true  },
    { nombre: 'Jumping jacks',        series: '4x20s', descanso: '10s', musculo: 'Cardio',    free: false },
    { nombre: 'Sentadillas con salto',series: '4x20s', descanso: '10s', musculo: 'Piernas',   free: false },
  ],
}

const RECENT_WORKOUTS = [
  { icon: '🏋️', name: 'Fuerza — Tren superior', when: 'Hace 1 día',  duration: '48 min', kcal: 320 },
  { icon: '🏃', name: 'Carrera matutina',         when: 'Hace 2 días', duration: '35 min', kcal: 290 },
  { icon: '🧘', name: 'Yoga restaurativo',         when: 'Hace 3 días', duration: '50 min', kcal: 120 },
  { icon: '⚡', name: 'HIIT metabólico',           when: 'Hace 5 días', duration: '25 min', kcal: 410 },
]

export default function WorkoutView({ showToast, openModal, isSubscribed }) {
  const [selected, setSelected] = useState(null)
  const [streak]  = useState(12)

  if (selected) {
    const ejercicios = EJERCICIOS[selected.id]
    return (
      <div style={{paddingBottom:'2rem',background:'#f4f9f5',minHeight:'100vh'}}>
        <div style={{padding:'1.5rem',display:'flex',alignItems:'center',gap:'12px',borderBottom:'1px solid rgba(26,122,74,0.1)',background:'#fff'}}>
          <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'#6b8c78',fontSize:'20px',cursor:'pointer'}}>←</button>
          <span style={{fontSize:'24px'}}>{selected.icon}</span>
          <div>
            <h2 style={{fontFamily:'Poppins,sans-serif',fontSize:'22px',fontWeight:700,color:'#1a2e23'}}>{selected.title}</h2>
            <p style={{fontSize:'12px',color:'#6b8c78',fontWeight:500}}>{selected.desc}</p>
          </div>
        </div>

        <div style={{padding:'1rem 1.5rem 0.5rem'}}>
          <h3 style={{fontFamily:'Poppins,sans-serif',fontSize:'18px',fontWeight:700,color:'#1a2e23'}}>Ejercicios de hoy</h3>
          {!isSubscribed && <p style={{fontSize:'12px',color:'#6b8c78',marginTop:'4px',fontWeight:500}}>Los 2 primeros son gratis. Desbloquea todos con Premium 🔓</p>}
        </div>

        <div style={{padding:'0 1.5rem',display:'flex',flexDirection:'column',gap:'8px'}}>
          {ejercicios.map((ej, i) => {
            const bloqueado = !isSubscribed && !ej.free
            return (
              <div key={i} style={{background: bloqueado ? '#f9f9f9' : '#fff', border:`1px solid ${bloqueado ? 'rgba(26,122,74,0.08)' : 'rgba(26,122,74,0.15)'}`, borderRadius:'14px', padding:'0.875rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', opacity: bloqueado ? 0.7 : 1, boxShadow:'0 1px 4px rgba(26,122,74,0.04)'}}>
                <div>
                  <p style={{fontSize:'14px', color: bloqueado ? '#aaa' : '#1a2e23', fontWeight:600, marginBottom:'4px'}}>
                    {bloqueado ? '🔒 Ejercicio bloqueado' : ej.nombre}
                  </p>
                  <p style={{fontSize:'11px',color:'#6b8c78',fontWeight:500}}>{bloqueado ? 'Solo para usuarios Premium' : `${ej.musculo} · Descanso: ${ej.descanso}`}</p>
                </div>
                {!bloqueado && (
                  <span style={{fontFamily:'Poppins,sans-serif',fontSize:'16px',fontWeight:700,color:'#1a7a4a'}}>{ej.series}</span>
                )}
              </div>
            )
          })}
        </div>

        {!isSubscribed && (
          <div style={{margin:'1rem 1.5rem',background:'#e8f5ed',border:'1.5px solid #1a7a4a',borderRadius:'16px',padding:'1.25rem',textAlign:'center'}}>
            <p style={{fontSize:'14px',color:'#1a2e23',fontWeight:700,marginBottom:'8px'}}>🔓 Desbloquea todos los ejercicios</p>
            <p style={{fontSize:'12px',color:'#6b8c78',marginBottom:'1rem',fontWeight:500}}>Rutinas completas personalizadas por solo 10 € / mes</p>
            <button onClick={openModal} style={{background:'#1a7a4a',color:'#fff',border:'none',padding:'10px 24px',borderRadius:'24px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              Ver planes Premium
            </button>
          </div>
        )}

        {isSubscribed && (
          <div style={{padding:'1rem 1.5rem'}}>
            <button onClick={() => { showToast('¡Entrenamiento completado! 🔥'); setSelected(null) }}
              style={{width:'100%',background:'#1a7a4a',color:'#fff',border:'none',padding:'13px',borderRadius:'30px',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              ✓ Marcar como completado
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>Movimiento</p>
          <h2 className="serif">Elige tu entreno</h2>
        </div>
        <div className={styles.streakBadge}>🔥 {streak} días seguidos</div>
      </div>

      <div className={styles.typeGrid}>
        {WORKOUT_TYPES.map(wt => (
          <button key={wt.id} className={styles.typeCard} style={{ background: wt.bg, borderColor: wt.border }} onClick={() => setSelected(wt)}>
            <span className={styles.typeIcon}>{wt.icon}</span>
            <h3 className={styles.typeTitle}>{wt.title}</h3>
            <p className={styles.typeDesc}>{wt.desc}</p>
          </button>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <h3>Historial reciente</h3>
      </div>

      <div className={styles.recentList}>
        {RECENT_WORKOUTS.map((w, i) => (
          <div key={i} className={styles.recentItem}>
            <div className={styles.recentIcon}>{w.icon}</div>
            <div>
              <p className={styles.recentName}>{w.name}</p>
              <p className={styles.recentMeta}>{w.when} · {w.duration}</p>
            </div>
            <div className={styles.recentKcal}>+{w.kcal} kcal</div>
          </div>
        ))}
      </div>

      <button className={styles.logBtn} onClick={() => showToast('Registrando entrenamiento...')}>
        + Registrar nuevo entrenamiento
      </button>
    </div>
  )
}