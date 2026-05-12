// =============================================
// views/Home.jsx — Landing page / Vista de inicio
// =============================================

import styles from './Home.module.css'

const FEATURES = [
  { icon: '🌿', title: 'Nutrición holística',    desc: 'Macros, micronutrientes y calidad de alimentos en un solo vistazo.' },
  { icon: '🔥', title: 'Entrenos inteligentes',  desc: 'Rutinas adaptadas a tu cuerpo y tus objetivos del día.' },
  { icon: '📈', title: 'Progreso real',           desc: 'Gráficas elegantes que muestran tu transformación semana a semana.' },
  { icon: '💧', title: 'Hidratación',             desc: 'Recordatorios sutiles integrados en tu rutina diaria.' },
  { icon: '🔗', title: 'Wearables',               desc: 'Sincronización con Apple Health, Garmin y Fitbit.' },
  { icon: '🤖', title: 'IA personalizada',        desc: 'Recomendaciones que aprenden de tus hábitos y objetivos.' },
]

const PERKS = [
  'Seguimiento ilimitado de alimentos',
  'Base de datos con +2 millones de alimentos',
  'Planes de entrenamiento personalizados',
  'Análisis de progreso avanzado',
  'Sincronización con wearables y apps de salud',
  'Recetas y planificación semanal',
  'Soporte prioritario en español',
]

export default function HomeView({ openModal, goToView }) {
  return (
    <div className={styles.wrapper}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>Bienestar de lujo · Nutrición · Movimiento</div>
        <h1 className={`${styles.heroTitle} serif`}>
          Tu cuerpo,<br /><em>tu obra maestra.</em>
        </h1>
        <p className={styles.heroSub}>
          Vitae no es una simple app de calorías. Es tu ritual diario de bienestar:
          nutrición inteligente, entrenamientos conscientes y progreso que puedes ver y sentir.
        </p>
        <div className={styles.heroBtns}>
          <button className="btn-primary" onClick={openModal}>
            Comenzar — 10 € / mes
          </button>
          <button className="btn-ghost" onClick={() => goToView('nutrition')}>
            Ver demo gratis
          </button>
        </div>
      </section>

      {/* Features grid */}
      <section className={styles.featuresGrid}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.featCard}>
            <span className={styles.featIcon}>{f.icon}</span>
            <h3 className={`${styles.featTitle} serif`}>{f.title}</h3>
            <p className={styles.featDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <h2 className="serif">Un precio.<br />Todo incluido.</h2>
        <p className={styles.pricingSubtitle}>Sin sorpresas. Sin niveles premium. Sin anuncios.</p>

        <div className={styles.priceRow}>
          <span className={styles.priceCurrency}>€</span>
          <span className={`${styles.priceAmount} serif`}>10</span>
          <span className={styles.pricePeriod}>/mes</span>
        </div>

        <ul className={styles.perksList}>
          {PERKS.map((p) => (
            <li key={p} className={styles.perkItem}>
              <span className={styles.perkDot}>✦</span>
              {p}
            </li>
          ))}
        </ul>

        <button className="btn-primary" onClick={openModal}>
          Empezar ahora por 10 €
        </button>
        <p className={styles.legalNote}>
          Cancela cuando quieras · Sin permanencia · IVA incluido
        </p>
      </section>
    </div>
  )
}
