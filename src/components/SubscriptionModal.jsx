// =============================================
// SubscriptionModal.jsx
// Modal de suscripción de 10 €/mes.
//
// INTEGRACIÓN CON STRIPE (producción):
//   1. npm install @stripe/stripe-js
//   2. Crea un producto en Stripe Dashboard (10 €/mes recurrente)
//   3. En onSubscribe(), llama a tu API backend que crea
//      una Stripe Checkout Session y redirige al usuario
//   4. Configura webhook para actualizar isSubscribed en tu BD
// =============================================

import styles from './SubscriptionModal.module.css'

const FEATURES = [
  'Base de datos con +2 millones de alimentos verificados',
  'Planes de entrenamiento personalizados con IA',
  'Análisis avanzado de progreso corporal',
  'Sincronización con Apple Health, Garmin y Fitbit',
  'Recetas y planes de comida semanales',
  'Soporte prioritario en español',
  'Sin anuncios. Sin límites. Sin sorpresas.',
]

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }) {
  if (!isOpen) return null

  // Cierra el modal al hacer clic fuera
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>

        <div className={styles.badge}>Acceso completo</div>

        <h2 id="modal-title" className={`${styles.title} serif`}>
          Únete a Vitae
        </h2>
        <p className={styles.subtitle}>
          Todo lo que necesitas para transformarte, por menos de lo que gastas en café a la semana.
        </p>

        <div className={styles.priceBlock}>
          <span className={styles.currency}>€</span>
          <span className={styles.amount}>10</span>
          <span className={styles.period}>/mes</span>
        </div>

        <ul className={styles.features}>
          {FEATURES.map((f, i) => (
            <li key={i} className={styles.feature}>
              <span className={styles.featureIcon}>✦</span>
              {f}
            </li>
          ))}
        </ul>

        <button className={`btn-primary ${styles.ctaBtn}`} onClick={onSubscribe}>
          Comenzar mi transformación
        </button>

        {/* TODO: Añadir enlace a Stripe aquí */}
        <p className={styles.legal}>
          Cancela cuando quieras · Sin permanencia · IVA incluido
        </p>

        <button className={styles.cancelLink} onClick={onClose}>
          Seguir con la versión gratuita
        </button>
      </div>
    </div>
  )
}
