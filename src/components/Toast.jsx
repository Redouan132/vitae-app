// Toast.jsx — Notificación emergente temporal
import styles from './Toast.module.css'

export default function Toast({ visible, message }) {
  return (
    <div className={`${styles.toast} ${visible ? styles.visible : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  )
}
