// =============================================
// components/FoodSearch.jsx
//
// Buscador de alimentos conectado a Open Food Facts.
// Permite buscar, seleccionar, ajustar gramos y añadir
// un alimento al registro del día.
//
// Props:
//   onAdd(food)  — callback cuando el usuario confirma un alimento
//   onClose()    — cierra el buscador
// =============================================

import { useState, useRef, useEffect, useCallback } from 'react'
import { searchFoods, recalcForGrams } from '../lib/foodApi'
import styles from './FoodSearch.module.css'

// Debounce de búsqueda para no saturar la API
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function FoodSearch({ onAdd, onClose, meal = 'Cena' }) {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [selected, setSelected] = useState(null)
  const [grams,    setGrams]    = useState(100)

  const debouncedQuery = useDebounce(query, 450)
  const inputRef = useRef(null)

  // Foco automático al abrir
  useEffect(() => { inputRef.current?.focus() }, [])

  // Búsqueda automática al cambiar el query
  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); setError(''); return }
    doSearch(debouncedQuery)
  }, [debouncedQuery])

  const doSearch = async (q) => {
    setLoading(true)
    setError('')
    setSelected(null)
    try {
      const data = await searchFoods(q, 15)
      setResults(data)
      if (data.length === 0) setError('Sin resultados. Prueba con otro nombre o en inglés.')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (food) => {
    setSelected(food)
    setGrams(100)
  }

  const handleGramsChange = (e) => {
    const g = Math.max(1, parseInt(e.target.value) || 1)
    setGrams(g)
  }

  const handleAdd = () => {
    if (!selected) return
    const foodToAdd = {
      ...recalcForGrams(selected, grams),
      meal,
      detail: `${grams}g${selected.brand ? ' · ' + selected.brand : ''}`,
    }
    onAdd(foodToAdd)
  }

  // Alimento con gramos ajustados
  const preview = selected ? recalcForGrams(selected, grams) : null

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Añadir alimento</h3>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
      </div>

      {/* Selector de comida */}
      <div className={styles.mealRow}>
        <span className={styles.mealLabel}>Para:</span>
        <select className={styles.mealSelect} value={meal} disabled>
          <option>Desayuno</option>
          <option>Almuerzo</option>
          <option>Merienda</option>
          <option>Cena</option>
          <option>Snack</option>
        </select>
      </div>

      {/* Buscador */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="Buscar alimento (ej: avena, pollo asado, yogur…)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {loading && <span className={styles.spinner}>⏳</span>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* ── Detalle del alimento seleccionado ── */}
      {selected && preview && (
        <div className={styles.detail}>
          <div className={styles.detailTop}>
            {selected.image && (
              <img src={selected.image} alt={selected.name} className={styles.detailImg} />
            )}
            <div>
              <p className={styles.detailName}>{selected.name}</p>
              {selected.brand && <p className={styles.detailBrand}>{selected.brand}</p>}
            </div>
          </div>

          {/* Ajuste de gramos */}
          <div className={styles.gramsRow}>
            <label className={styles.gramsLabel}>Cantidad (gramos)</label>
            <div className={styles.gramsInput}>
              <button className={styles.gramBtn} onClick={() => setGrams(g => Math.max(1, g - 10))}>−</button>
              <input
                type="number"
                min="1"
                max="2000"
                value={grams}
                onChange={handleGramsChange}
                className={styles.gramsField}
              />
              <button className={styles.gramBtn} onClick={() => setGrams(g => g + 10)}>+</button>
            </div>
          </div>

          {/* Macros calculados */}
          <div className={styles.macros}>
            <div className={styles.macro}><span className={styles.macroVal}>{preview.kcal}</span><span className={styles.macroLbl}>kcal</span></div>
            <div className={styles.macroDivider}/>
            <div className={styles.macro}><span className={styles.macroVal}>{preview.prot}g</span><span className={styles.macroLbl}>proteína</span></div>
            <div className={styles.macroDivider}/>
            <div className={styles.macro}><span className={styles.macroVal}>{preview.carbs}g</span><span className={styles.macroLbl}>carbos</span></div>
            <div className={styles.macroDivider}/>
            <div className={styles.macro}><span className={styles.macroVal}>{preview.fat}g</span><span className={styles.macroLbl}>grasas</span></div>
          </div>

          <div className={styles.detailActions}>
            <button className={styles.cancelDetail} onClick={() => setSelected(null)}>← Volver</button>
            <button className={styles.addBtn} onClick={handleAdd}>Añadir al registro</button>
          </div>
        </div>
      )}

      {/* ── Lista de resultados ── */}
      {!selected && results.length > 0 && (
        <div className={styles.resultsList}>
          {results.map(food => (
            <button
              key={food.id}
              className={styles.resultItem}
              onClick={() => handleSelect(food)}
            >
              {food.image
                ? <img src={food.image} alt="" className={styles.resultImg} />
                : <div className={styles.resultImgPlaceholder}>🥗</div>
              }
              <div className={styles.resultInfo}>
                <p className={styles.resultName}>{food.name}</p>
                {food.brand && <p className={styles.resultBrand}>{food.brand}</p>}
              </div>
              <div className={styles.resultKcal}>
                <span className={styles.resultKcalNum}>{food.per100.kcal}</span>
                <span className={styles.resultKcalLbl}>kcal/100g</span>
              </div>
            </button>
          ))}
          <p className={styles.attribution}>
            Datos: <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">Open Food Facts</a> — Licencia ODbL
          </p>
        </div>
      )}

      {/* Estado vacío inicial */}
      {!selected && results.length === 0 && !loading && !error && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🌿</span>
          <p>Escribe al menos 2 letras para buscar entre millones de alimentos.</p>
        </div>
      )}
    </div>
  )
}
