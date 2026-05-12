// components/Nav.jsx — v2 con info de usuario y logout
import styles from './Nav.module.css'

const TABS = [
  { id: 'home',      label: 'Inicio'    },
  { id: 'nutrition', label: 'Nutrición' },
  { id: 'workout',   label: 'Entreno'   },
  { id: 'progress',  label: 'Progreso'  },
]

export default function Nav({ activeView, onChangeView, onOpenModal, isSubscribed, user, onLogout }) {
  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>vi<em>tae</em></div>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeView === tab.id ? styles.active : ''}`}
            onClick={() => onChangeView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.right}>
        {!isSubscribed && (
          <button className={styles.subPill} onClick={onOpenModal}>10 € / mes</button>
        )}
        {user && (
          <div className={styles.userMenu}>
            <button className={styles.avatar} title={user.email}>{initials}</button>
            <div className={styles.dropdown}>
              <p className={styles.dropEmail}>{user.user_metadata?.name || user.email}</p>
              <hr className={styles.dropDivider} />
              {isSubscribed && <span className={styles.premiumBadge}>✦ Premium activo</span>}
              <button className={styles.dropBtn} onClick={onLogout}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
