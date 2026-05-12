import { useState, useRef, useEffect } from 'react'
import { getFood } from '../lib/foodApi'

export default function FoodScanner({ onAdd, onClose, meal = 'Cena' }) {
  const videoRef    = useRef(null)
  const streamRef   = useRef(null)
  const intervalRef = useRef(null)

  const [status,     setStatus]     = useState('iniciando')
  const [product,    setProduct]    = useState(null)
  const [grams,      setGrams]      = useState(100)
  const [error,      setError]      = useState('')
  const [manualCode, setManualCode] = useState('')

  useEffect(() => { startCamera(); return () => stopCamera() }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setStatus('escaneando')
        startDetection()
      }
    } catch {
      setStatus('nocamara')
    }
  }

  const stopCamera = () => {
    clearInterval(intervalRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  const startDetection = async () => {
    if (!('BarcodeDetector' in window)) return
    const detector = new window.BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e']
    })
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return
      try {
        const codes = await detector.detect(videoRef.current)
        if (codes.length > 0) {
          clearInterval(intervalRef.current)
          await lookupBarcode(codes[0].rawValue)
        }
      } catch {}
    }, 500)
  }

  const lookupBarcode = async (code) => {
    stopCamera()
    setStatus('buscando')
    try {
      const food = await getFood(code)
      if (food && food.kcal > 0) {
        setProduct(food)
        setStatus('encontrado')
      } else {
        setError(`No encontramos el código ${code}. Prueba manualmente.`)
        setStatus('error')
      }
    } catch {
      setError('Error al buscar. Comprueba tu conexión.')
      setStatus('error')
    }
  }

  const handleManual = async (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    await lookupBarcode(manualCode.trim())
  }

  const handleAdd = () => {
    if (!product) return
    const r = grams / 100
    onAdd({
      ...product,
      grams,
      kcal:   Math.round(product.per100.kcal  * r),
      prot:   Math.round(product.per100.prot  * r * 10) / 10,
      carbs:  Math.round(product.per100.carbs * r * 10) / 10,
      fat:    Math.round(product.per100.fat   * r * 10) / 10,
      meal,
      detail: `${grams}g${product.brand ? ' · ' + product.brand : ''}`,
    })
  }

  const preview = product ? (() => {
    const r = grams / 100
    return {
      kcal:  Math.round(product.per100.kcal  * r),
      prot:  Math.round(product.per100.prot  * r * 10) / 10,
      carbs: Math.round(product.per100.carbs * r * 10) / 10,
      fat:   Math.round(product.per100.fat   * r * 10) / 10,
    }
  })() : null

  return (
    <div style={{background:'#fff',border:'1px solid rgba(26,122,74,0.15)',borderRadius:'20px',margin:'0 1.5rem 1rem',overflow:'hidden',boxShadow:'0 2px 12px rgba(26,122,74,0.06)'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.25rem',borderBottom:'1px solid rgba(26,122,74,0.1)'}}>
        <span style={{fontFamily:'Poppins,sans-serif',fontSize:'17px',fontWeight:700,color:'#1a2e23'}}>📷 Escanear producto</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#6b8c78',fontSize:'20px',cursor:'pointer'}}>×</button>
      </div>

      {/* Cámara */}
      {status === 'escaneando' && (
        <div style={{position:'relative',width:'100%',background:'#000',aspectRatio:'4/3'}}>
          <video ref={videoRef} style={{width:'100%',height:'100%',objectFit:'cover'}} muted playsInline/>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'12px'}}>
            <div style={{width:'200px',height:'120px',border:'2.5px solid #34c472',borderRadius:'12px'}}/>
            <span style={{color:'#fff',fontSize:'13px',fontWeight:600,background:'rgba(0,0,0,0.5)',padding:'6px 16px',borderRadius:'20px',fontFamily:'Poppins,sans-serif'}}>
              Apunta al código de barras
            </span>
          </div>
        </div>
      )}

      {/* Buscando */}
      {status === 'buscando' && (
        <div style={{padding:'2rem',textAlign:'center'}}>
          <span style={{fontSize:'32px',display:'block',marginBottom:'12px',animation:'spin 1s linear infinite'}}>🔍</span>
          <p style={{color:'#6b8c78',fontFamily:'Poppins,sans-serif',fontSize:'14px',fontWeight:500}}>Buscando producto...</p>
        </div>
      )}

      {/* Iniciando */}
      {status === 'iniciando' && (
        <div style={{padding:'2rem',textAlign:'center'}}>
          <span style={{fontSize:'28px',display:'block',marginBottom:'12px'}}>⏳</span>
          <p style={{color:'#6b8c78',fontSize:'13px',fontWeight:500,fontFamily:'Poppins,sans-serif'}}>Iniciando cámara...</p>
        </div>
      )}

      {/* Sin cámara */}
      {status === 'nocamara' && (
        <div style={{padding:'1.5rem',textAlign:'center'}}>
          <span style={{fontSize:'32px',display:'block',marginBottom:'12px'}}>📵</span>
          <p style={{color:'#6b8c78',fontSize:'13px',fontWeight:500,marginBottom:'12px',fontFamily:'Poppins,sans-serif'}}>
            No se puede acceder a la cámara. Introduce el código manualmente.
          </p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{padding:'1.5rem',textAlign:'center'}}>
          <span style={{fontSize:'32px',display:'block',marginBottom:'12px'}}>😕</span>
          <p style={{color:'#c0392b',fontSize:'13px',marginBottom:'12px',fontFamily:'Poppins,sans-serif',fontWeight:500}}>{error}</p>
          <button onClick={() => { setStatus('iniciando'); setError(''); startCamera() }}
            style={{background:'none',border:'1.5px solid rgba(26,122,74,0.3)',color:'#1a7a4a',padding:'8px 20px',borderRadius:'24px',fontFamily:'Poppins,sans-serif',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Entrada manual */}
      {(status === 'nocamara' || status === 'error' || status === 'escaneando') && (
        <div style={{padding:'1rem 1.25rem',borderTop:'1px solid rgba(26,122,74,0.1)'}}>
          <p style={{fontSize:'12px',color:'#6b8c78',marginBottom:'8px',fontWeight:600,fontFamily:'Poppins,sans-serif'}}>O introduce el código de barras:</p>
          <form onSubmit={handleManual} style={{display:'flex',gap:'8px'}}>
            <input
              type="text"
              placeholder="Ej: 8410014001102"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              style={{flex:1,background:'#f4f9f5',border:'1.5px solid rgba(26,122,74,0.2)',borderRadius:'10px',padding:'10px 14px',fontFamily:'Poppins,sans-serif',fontSize:'14px',color:'#1a2e23',outline:'none'}}
            />
            <button type="submit"
              style={{background:'#1a7a4a',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'10px',fontFamily:'Poppins,sans-serif',fontSize:'13px',fontWeight:600,cursor:'pointer'}}>
              Buscar
            </button>
          </form>
        </div>
      )}

      {/* Producto encontrado */}
      {status === 'encontrado' && product && preview && (
        <div style={{padding:'1.25rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            {product.image && <img src={product.image} alt="" style={{width:'56px',height:'56px',borderRadius:'12px',objectFit:'cover'}}/>}
            <div>
              <p style={{fontSize:'15px',fontWeight:700,color:'#1a2e23',marginBottom:'4px',fontFamily:'Poppins,sans-serif'}}>{product.name}</p>
              {product.brand && <p style={{fontSize:'12px',color:'#6b8c78',fontWeight:500}}>{product.brand}</p>}
            </div>
          </div>

          {/* Macros */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'#f4f9f5',borderRadius:'12px',overflow:'hidden'}}>
            {[{val:preview.kcal,lbl:'kcal'},{val:`${preview.prot}g`,lbl:'prot'},{val:`${preview.carbs}g`,lbl:'carbos'},{val:`${preview.fat}g`,lbl:'grasas'}].map((m,i)=>(
              <div key={i} style={{padding:'0.75rem 0.5rem',textAlign:'center',borderRight:i<3?'1px solid rgba(26,122,74,0.1)':'none'}}>
                <span style={{display:'block',fontFamily:'Poppins,sans-serif',fontSize:'17px',fontWeight:700,color:'#1a7a4a',lineHeight:1,marginBottom:'4px'}}>{m.val}</span>
                <span style={{fontSize:'10px',color:'#6b8c78',fontWeight:600,textTransform:'uppercase'}}>{m.lbl}</span>
              </div>
            ))}
          </div>

          {/* Gramos */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:'13px',color:'#6b8c78',fontWeight:600}}>Cantidad (gramos)</span>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <button onClick={()=>setGrams(g=>Math.max(1,g-10))} style={{width:'34px',height:'34px',borderRadius:'50%',border:'1.5px solid rgba(26,122,74,0.2)',background:'#f4f9f5',color:'#1a2e23',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>−</button>
              <input type="number" value={grams} onChange={e=>setGrams(Math.max(1,parseInt(e.target.value)||1))}
                style={{width:'60px',background:'#f4f9f5',border:'1.5px solid rgba(26,122,74,0.2)',borderRadius:'10px',color:'#1a7a4a',fontFamily:'Poppins,sans-serif',fontSize:'18px',fontWeight:700,textAlign:'center',padding:'4px',outline:'none'}}/>
              <button onClick={()=>setGrams(g=>g+10)} style={{width:'34px',height:'34px',borderRadius:'50%',border:'1.5px solid rgba(26,122,74,0.2)',background:'#f4f9f5',color:'#1a2e23',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>+</button>
            </div>
          </div>

          <button onClick={handleAdd}
            style={{width:'100%',background:'#1a7a4a',color:'#fff',border:'none',padding:'13px',borderRadius:'30px',fontFamily:'Poppins,sans-serif',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
            Añadir al registro
          </button>

          <p style={{fontSize:'10px',color:'#6b8c78',textAlign:'center'}}>
            Datos: <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer" style={{color:'#1a7a4a'}}>Open Food Facts</a>
          </p>
        </div>
      )}
    </div>
  )
}