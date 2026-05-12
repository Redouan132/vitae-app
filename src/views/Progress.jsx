// =============================================
// views/Progress.jsx — Progreso y estadísticas
// =============================================

import styles from './Progress.module.css'

const STATS = [
  { label: 'Peso actual',      value: '72.4',   unit: 'kg',        change: '↓ 0.6 kg esta semana',          up: false },
  { label: 'Calorías (media)', value: '1.820',  unit: 'kcal/día',  change: '↓ 160 vs semana anterior',      up: false },
  { label: 'Entrenamientos',   value: '4',      unit: '/ 5 meta',  change: '↑ 1 más que la semana pasada',  up: true  },
  { label: 'Agua media',       value: '6.4',    unit: 'vasos/día', change: '↑ Bien encaminado/a',            up: true  },
]

const WEEK_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const CAL_DATA  = [1920, 1750, 2100, 1680, 1880, 1500, 1820]
const PROT_DATA = [125,  110,  140,  98,   132,  115,  112 ]
const WEIGHT_DATA = [73.0, 72.8, 72.9, 72.6, 72.5, 72.3, 72.4]

function MiniBarChart({ data, color }) {
  const max = Math.max(...data)
  return (
    <div className={styles.chartBars}>
      {data.map((v, i) => (
        <div
          key={i}
          className={styles.chartBar}
          style={{
            height: `${Math.round((v / max) * 100)}%`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.55,
          }}
          title={v.toString()}
        />
      ))}
    </div>
  )
}

export default function ProgressView({ openModal }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.label}>Tu transformación</p>
        <h2 className="serif">Progreso de la semana</h2>
      </div>

      {/* Tarjetas de métricas */}
      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statTile}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>
              {s.value} <span className={styles.statUnit}>{s.unit}</span>
            </p>
            <p className={`${styles.statChange} ${s.up ? styles.positive : styles.neutral}`}>
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Gráfica calorías */}
      <div className={styles.chartCard}>
        <h3 className="serif">Calorías — últimos 7 días</h3>
        <MiniBarChart data={CAL_DATA} color="var(--gold)" />
        <div className={styles.weekLabels}>
          {WEEK_LABELS.map(l => <span key={l}>{l}</span>)}
        </div>
      </div>

      {/* Gráfica proteína */}
      <div className={styles.chartCard}>
        <h3 className="serif">Proteína diaria (g)</h3>
        <MiniBarChart data={PROT_DATA} color="var(--sage)" />
        <div className={styles.weekLabels}>
          {WEEK_LABELS.map(l => <span key={l}>{l}</span>)}
        </div>
      </div>

      {/* Gráfica peso */}
      <div className={styles.chartCard}>
        <h3 className="serif">Evolución del peso (kg)</h3>
        <MiniBarChart data={WEIGHT_DATA} color="#b8a4e8" />
        <div className={styles.weekLabels}>
          {WEEK_LABELS.map(l => <span key={l}>{l}</span>)}
        </div>
      </div>

      <button className="btn-ghost" style={{ margin: '0 1.5rem', width: 'calc(100% - 3rem)' }} onClick={openModal}>
        Desbloquear análisis avanzado →
      </button>
    </div>
  )
}
