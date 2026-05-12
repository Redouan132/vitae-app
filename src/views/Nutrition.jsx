// views/Nutrition.jsx — v2 con Open Food Facts
import { useState } from 'react'
import FoodSearch from '../components/FoodSearch'
import styles from './Nutrition.module.css'

const INITIAL_FOODS = [
  {id:1,name:'Avena con frutos rojos',       meal:'Desayuno',detail:'80g avena, 100g frutos rojos',kcal:387,prot:14,carbs:58,fat:6},
  {id:2,name:'Pechuga de pollo a la plancha',meal:'Almuerzo',detail:'200g',                         kcal:330,prot:48,carbs:0, fat:7},
  {id:3,name:'Ensalada mediterránea',         meal:'Almuerzo',detail:'Tomate, mozzarella, aceite',  kcal:290,prot:18,carbs:12,fat:20},
  {id:4,name:'Yogur griego con nueces',       meal:'Merienda',detail:'150g yogur, 20g nueces',      kcal:285,prot:22,carbs:10,fat:16},
  {id:5,name:'Salmón al horno con verduras',  meal:'Cena',    detail:'180g salmón',                 kcal:188,prot:34,carbs:0, fat:14},
]

const GOAL = { kcal:1980, prot:150, carbs:200, fat:65 }

export default function NutritionView({ openModal, showToast, isSubscribed }) {
  const [foods,      setFoods]      = useState(INITIAL_FOODS)
  const [water,      setWater]      = useState(5)
  const [showSearch, setShowSearch] = useState(false)
  const [activeMeal, setActiveMeal] = useState('Cena')

  const total = foods.reduce((a,f) => ({
    kcal: a.kcal+f.kcal, prot: a.prot+f.prot, carbs: a.carbs+f.carbs, fat: a.fat+f.fat
  }), {kcal:0,prot:0,carbs:0,fat:0})

  const pct = Math.min(1, total.kcal / GOAL.kcal)
  const CIRC = 289

  const handleAdd = (food) => {
    setFoods(prev => [...prev, { ...food, id: Date.now() }])
    setShowSearch(false)
    showToast(`${food.name} añadido ✦`)
  }

  const handleRemove = (id) => {
    setFoods(prev => prev.filter(f => f.id !== id))
    showToast('Alimento eliminado')
  }

  const toggleSearch = () => {
    if (!isSubscribed) { openModal(); return }
    setShowSearch(s => !s)
  }

  const toggleWater = (i) => setWater(i < water ? i : i + 1)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.dateLabel}>{new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</p>
        <h2>Tu nutrición de hoy</h2>
      </div>

      {/* Anillo de calorías */}
      <div className={styles.macroCard}>
        <div className={styles.ringWrap}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{transform:'rotate(-90deg)'}}>
            <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="10"/>
            <circle cx="55" cy="55" r="46" fill="none" stroke="var(--gold)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRC} strokeDashoffset={CIRC - CIRC * pct}
              style={{transition:'stroke-dashoffset 1s ease'}}/>
          </svg>
          <div className={styles.ringCenter}>
            <div className={styles.ringNum}>{total.kcal.toLocaleString('es-ES')}</div>
            <div className={styles.ringLabel}>kcal</div>
          </div>
        </div>
        <div className={styles.macroList}>
          {[
            {label:'Proteína',value:total.prot, goal:GOAL.prot, color:'var(--gold)'},
            {label:'Carbos',  value:total.carbs,goal:GOAL.carbs,color:'var(--sage)'},
            {label:'Grasas',  value:total.fat,  goal:GOAL.fat,  color:'#b8a4e8'},
          ].map(m => (
            <div key={m.label} className={styles.macroRow}>
              <div className={styles.macroLabelRow}>
                <span className="text-muted">{m.label}</span>
                <span>{m.value}g / {m.goal}g</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{width:`${Math.min(100,Math.round(m.value/m.goal*100))}%`,background:m.color}}/>
              </div>
            </div>
          ))}
          <p className={styles.remaining}>
            Restante: <span className="text-sage">{Math.max(0, GOAL.kcal - total.kcal).toLocaleString('es-ES')} kcal</span>
          </p>
        </div>
      </div>

      {/* Agua */}
      <div className={styles.secHeader}>
        <h3>Agua</h3>
        <span style={{fontFamily:'var(--font-serif)',fontSize:'13px',color:'var(--sage)'}}>{water} / 8 vasos</span>
      </div>
      <div className={styles.waterCard}>
        <div className={styles.waterTrack}>
          {Array.from({length:8},(_,i) => (
            <button key={i} className={`${styles.drop} ${i<water?styles.filled:''}`} onClick={() => toggleWater(i)}>
              {i<water?'💧':''}
            </button>
          ))}
        </div>
        <p className={styles.waterHint}>Pulsa cada gota para registrar un vaso (250 ml)</p>
      </div>

      {/* Cabecera lista + selector de comida */}
      <div className={styles.secHeader}>
        <h3>Registro del día</h3>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          {isSubscribed && (
            <select
              className={styles.mealSelect}
              value={activeMeal}
              onChange={e => setActiveMeal(e.target.value)}
            >
              {['Desayuno','Almuerzo','Merienda','Cena','Snack'].map(m => <option key={m}>{m}</option>)}
            </select>
          )}
          <button className={styles.secBtn} onClick={toggleSearch}>
            {showSearch ? '✕ Cerrar' : '+ Añadir'}
          </button>
        </div>
      </div>

      {/* Buscador Open Food Facts */}
      {showSearch && isSubscribed && (
        <FoodSearch meal={activeMeal} onAdd={handleAdd} onClose={() => setShowSearch(false)} />
      )}

      {/* Lista de alimentos */}
      <div className={styles.foodList}>
        {foods.map(food => (
          <div key={food.id} className={styles.foodItem}>
            <div>
              <p className={styles.foodName}>{food.name}</p>
              <p className={styles.foodDetail}>{food.meal} · {food.detail}</p>
            </div>
            <div className={styles.foodRight}>
              <div className={styles.foodKcal}>{food.kcal}</div>
              <div className={styles.foodKcalLabel}>kcal</div>
              <button className={styles.removeBtn} onClick={() => handleRemove(food.id)}>×</button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addCta} onClick={toggleSearch}>
        {isSubscribed ? '✦ Buscar alimento en Open Food Facts' : '✦ Añadir alimento (función premium)'}
      </button>
    </div>
  )
}
