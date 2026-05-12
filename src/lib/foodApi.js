// =============================================
// lib/foodApi.js — Integración Open Food Facts
//
// Open Food Facts es una base de datos gratuita
// y open source con más de 3 millones de productos.
// No requiere API key — es 100% gratuita.
// Documentación: https://world.openfoodfacts.org/data
//
// FUNCIONES EXPORTADAS:
//   searchFoods(query)   → busca alimentos por nombre
//   getFood(barcode)     → obtiene un producto por código de barras
//   formatFood(product)  → normaliza los datos de la API
// =============================================

const BASE_URL = 'https://world.openfoodfacts.org'

// Campos que pedimos (para reducir tamaño de respuesta)
const FIELDS = [
  'code',
  'product_name',
  'product_name_es',
  'brands',
  'serving_size',
  'nutriments',
  'image_front_small_url',
  'categories_tags',
].join(',')

/**
 * Busca alimentos por nombre en Open Food Facts
 * @param {string} query — término de búsqueda (ej: "avena", "pollo asado")
 * @param {number} pageSize — número de resultados (máx 50)
 * @returns {Promise<NormalizedFood[]>}
 */
export async function searchFoods(query, pageSize = 20) {
  if (!query || query.trim().length < 2) return []

  try {
    const params = new URLSearchParams({
      search_terms:   query.trim(),
      search_simple:  '1',
      action:         'process',
      json:           '1',
      page_size:      pageSize,
      fields:         FIELDS,
      // Prioriza resultados en español
      lc: 'es',
      cc: 'es',
    })

    const res = await fetch(`${BASE_URL}/cgi/search.pl?${params}`, {
      headers: {
        // Identifica tu app (buena práctica con Open Food Facts)
        'User-Agent': 'VitaeApp/2.0 (contacto@tudominio.com)',
      },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    return (data.products || [])
      .map(formatFood)
      .filter(f => f.name && f.kcal > 0)  // solo productos con datos útiles
  } catch (err) {
    console.error('Open Food Facts error:', err)
    throw new Error('No se pudo conectar con la base de datos de alimentos.')
  }
}

/**
 * Obtiene un producto por código de barras
 * @param {string} barcode — EAN-13 o EAN-8
 * @returns {Promise<NormalizedFood|null>}
 */
export async function getFood(barcode) {
  try {
    const res  = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json?fields=${FIELDS}`)
    const data = await res.json()
    if (data.status !== 1) return null
    return formatFood(data.product)
  } catch (err) {
    console.error('Open Food Facts barcode error:', err)
    return null
  }
}

/**
 * Normaliza un producto de la API al formato interno de Vitae.
 * Los nutriments de Open Food Facts vienen por 100g,
 * así que los guardamos así y calculamos al mostrar.
 *
 * @param {object} product — producto crudo de la API
 * @returns {NormalizedFood}
 */
export function formatFood(product) {
  const n = product.nutriments || {}

  // Nombre: preferir español, si no inglés, si no el genérico
  const name = (
    product.product_name_es ||
    product.product_name    ||
    'Producto sin nombre'
  ).trim()

  // Valores por 100g
  const per100 = {
    kcal:  Math.round(n['energy-kcal_100g']   || n['energy_100g'] / 4.184 || 0),
    prot:  Math.round((n['proteins_100g']      || 0) * 10) / 10,
    carbs: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
    fat:   Math.round((n['fat_100g']           || 0) * 10) / 10,
    fiber: Math.round((n['fiber_100g']         || 0) * 10) / 10,
    sugar: Math.round((n['sugars_100g']        || 0) * 10) / 10,
    salt:  Math.round((n['salt_100g']          || 0) * 100) / 100,
  }

  return {
    id:           product.code || crypto.randomUUID(),
    name,
    brand:        product.brands || '',
    servingSize:  product.serving_size || '100g',
    image:        product.image_front_small_url || null,
    per100,
    // Valores para una porción de 100g (ajustable por el usuario)
    grams:   100,
    kcal:    per100.kcal,
    prot:    per100.prot,
    carbs:   per100.carbs,
    fat:     per100.fat,
  }
}

/**
 * Recalcula los macros de un alimento dado un peso en gramos.
 * Útil cuando el usuario ajusta la cantidad.
 * @param {NormalizedFood} food
 * @param {number} grams
 * @returns {NormalizedFood}
 */
export function recalcForGrams(food, grams) {
  const ratio = grams / 100
  return {
    ...food,
    grams,
    kcal:  Math.round(food.per100.kcal  * ratio),
    prot:  Math.round(food.per100.prot  * ratio * 10) / 10,
    carbs: Math.round(food.per100.carbs * ratio * 10) / 10,
    fat:   Math.round(food.per100.fat   * ratio * 10) / 10,
  }
}

/**
 * @typedef {object} NormalizedFood
 * @property {string}  id
 * @property {string}  name
 * @property {string}  brand
 * @property {string}  servingSize
 * @property {string|null} image
 * @property {object}  per100       — macros por 100g
 * @property {number}  grams        — gramos que el usuario va a registrar
 * @property {number}  kcal
 * @property {number}  prot
 * @property {number}  carbs
 * @property {number}  fat
 */
