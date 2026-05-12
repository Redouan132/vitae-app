import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ACTIVITY_LEVELS = [
  { id: 'sedentary',   label: 'Sedentario',  desc: 'Trabajo de oficina, poco movimiento', factor: 1.2   },
  { id: 'light',       label: 'Ligero',      desc: '1-3 días de ejercicio por semana',    factor: 1.375 },
  { id: 'moderate',    label: 'Moderado',    desc: '3-5 días de ejercicio por semana',    factor: 1.55  },
  { id: 'active',      label: 'Activo',      desc: '6-7 días de ejercicio por semana',    factor: 1.725 },
  { id: 'very_active', label: 'Muy activo',  desc: 'Ejercicio intenso + trabajo físico',  factor: 1.9   },
]

const GOALS = [
  { id: 'lose',     label: 'Perder peso',   icon: '📉', adjustment: -500 },
  { id: 'maintain', label: 'Mantener',      icon: '⚖️', adjustment: 0   },
  { id: 'gain',     label: 'Ganar músculo', icon: '📈', adjustment: 300  },
]

function calcCalories({ gender, age, height, weight, activityId, goalId }) {
  const activity = ACTIVITY_LEVELS.find(a => a.id === activityId)
  const goal     = GOALS.find(g => g.id === goalId)
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161
  const tdee   = Math.round(bmr * activity.factor)
  const target = tdee + goal.adjustment
  const prot   = Math.round(weight * 1.8)
  const fat    = Math.round((target * 0.25) / 9)
  const carbs  = Math.round((target - prot * 4 - fat * 9) / 4)
  return { tdee, target, prot, carbs, fat }
}

const s = {
  wrapper:    { minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem 1.5rem', gap:'1.25rem', maxWidth:'480px', margin:'0 auto', background:'#f4f9f5' },
  logo:       { fontFamily:'Poppins,sans-serif', fontSize:'28px', fontWeight:700, letterSpacing:'3px', color:'#1a7a4a', textTransform:'uppercase' },
  bar:        { width:'100%', height:'6px', background:'rgba(26,122,74,0.1)', borderRadius:'4px', overflow:'hidden' },
  barFill:    { height:'100%', background:'#1a7a4a', borderRadius:'4px', transition:'width 0.4s' },
  stepLabel:  { fontSize:'11px', color:'#6b8c78', alignSelf:'flex-end', fontWeight:500 },
  card:       { width:'100%', background:'#fff', border:'1px solid rgba(26,122,74,0.15)', borderRadius:'24px', padding:'2rem 1.75rem', display:'flex', flexDirection:'column', gap:'1rem', boxShadow:'0 4px 20px rgba(26,122,74,0.08)' },
  question:   { fontSize:'24px', fontWeight:700, color:'#1a2e23', lineHeight:1.2, fontFamily:'Poppins,sans-serif' },
  hint:       { fontSize:'13px', color:'#6b8c78', lineHeight:1.6 },
  optGrid:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'0.5rem' },
  opt:        { background:'#f4f9f5', border:'1.5px solid rgba(26,122,74,0.15)', borderRadius:'16px', padding:'1.5rem 1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', cursor:'pointer', transition:'all 0.2s' },
  optSel:     { background:'#e8f5ed', border:'1.5px solid #1a7a4a', borderRadius:'16px', padding:'1.5rem 1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', cursor:'pointer' },
  numInput:   { display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', marginTop:'0.5rem' },
  numBtn:     { width:'48px', height:'48px', borderRadius:'50%', border:'1.5px solid rgba(26,122,74,0.2)', background:'#f4f9f5', color:'#1a2e23', fontSize:'24px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' },
  numField:   { background:'none', border:'none', color:'#1a7a4a', fontFamily:'Poppins,sans-serif', fontSize:'52px', fontWeight:700, width:'120px', textAlign:'center', outline:'none' },
  numUnit:    { fontSize:'18px', color:'#6b8c78', fontWeight:500 },
  actList:    { display:'flex', flexDirection:'column', gap:'8px', marginTop:'0.5rem' },
  actItem:    { display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f4f9f5', border:'1.5px solid rgba(26,122,74,0.15)', borderRadius:'14px', padding:'0.875rem 1rem', cursor:'pointer', textAlign:'left', transition:'all 0.2s' },
  actItemSel: { display:'flex', alignItems:'center', justifyContent:'space-between', background:'#e8f5ed', border:'1.5px solid #1a7a4a', borderRadius:'14px', padding:'0.875rem 1rem', cursor:'pointer', textAlign:'left' },
  actLbl:     { fontSize:'14px', color:'#1a2e23', fontWeight:600, marginBottom:'2px', fontFamily:'Poppins,sans-serif' },
  actDesc:    { fontSize:'11px', color:'#6b8c78' },
  check:      { width:'22px', height:'22px', borderRadius:'50%', border:'1.5px solid rgba(26,122,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'#fff', flexShrink:0 },
  checkOn:    { width:'22px', height:'22px', borderRadius:'50%', background:'#1a7a4a', border:'1.5px solid #1a7a4a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'#fff', flexShrink:0 },
  goalGrid:   { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginTop:'0.5rem' },
  goalCard:   { background:'#f4f9f5', border:'1.5px solid rgba(26,122,74,0.15)', borderRadius:'16px', padding:'1.25rem 0.75rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', cursor:'pointer', transition:'all 0.2s' },
  goalCardSel:{ background:'#e8f5ed', border:'1.5px solid #1a7a4a', borderRadius:'16px', padding:'1.25rem 0.75rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', cursor:'pointer' },
  navBtns:    { display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' },
  backBtn:    { background:'none', border:'none', color:'#6b8c78', fontSize:'14px', fontFamily:'Poppins,sans-serif', cursor:'pointer' },
  nextBtn:    { background:'#1a7a4a', color:'#fff', border:'none', padding:'13px 28px', borderRadius:'30px', fontSize:'14px', fontWeight:600, fontFamily:'Poppins,sans-serif', marginLeft:'auto', cursor:'pointer' },
  nextBtnDis: { background:'#1a7a4a', color:'#fff', border:'none', padding:'13px 28px', borderRadius:'30px', fontSize:'14px', fontWeight:600, fontFamily:'Poppins,sans-serif', marginLeft:'auto', opacity:0.4, cursor:'not-allowed' },
  resultCard: { width:'100%', background:'#fff', border:'2px solid #1a7a4a', borderRadius:'24px', padding:'2.5rem 2rem', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', boxShadow:'0 4px 20px rgba(26,122,74,0.12)' },
  resultGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', width:'100%' },
  resultStat: { background:'#f4f9f5', border:'1px solid rgba(26,122,74,0.1)', borderRadius:'14px', padding:'1rem' },
  resultNum:  { fontFamily:'Poppins,sans-serif', fontSize:'26px', fontWeight:700, color:'#1a7a4a', display:'block', lineHeight:1, marginBottom:'4px' },
  resultLbl:  { fontSize:'11px', color:'#6b8c78', textTransform:'uppercase', fontWeight:600 },
  ctaBtn:     { width:'100%', background:'#1a7a4a', color:'#fff', border:'none', padding:'14px', borderRadius:'30px', fontSize:'15px', fontWeight:600, fontFamily:'Poppins,sans-serif', cursor:'pointer', marginTop:'0.5rem' },
  error:      { fontSize:'12px', color:'#c0392b', background:'rgba(220,80,80,0.08)', border:'1px solid rgba(220,80,80,0.2)', borderRadius:'10px', padding:'8px 12px', width:'100%' },
}

export default function ProfileSetupView({ user, onComplete }) {
  const [step,       setStep]       = useState(0)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [gender,     setGender]     = useState('')
  const [age,        setAge]        = useState('')
  const [height,     setHeight]     = useState('')
  const [weight,     setWeight]     = useState('')
  const [activityId, setActivityId] = useState('')
  const [goalId,     setGoalId]     = useState('')

  const canContinue = () => {
    switch (step) {
      case 0: return gender !== ''
      case 1: return age >= 10 && age <= 100
      case 2: return height >= 100 && height <= 250
      case 3: return weight >= 30 && weight <= 300
      case 4: return activityId !== ''
      case 5: return goalId !== ''
      default: return false
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const macros = calcCalories({ gender, age: parseInt(age), height: parseInt(height), weight: parseInt(weight), activityId, goalId })
    const { error: err } = await supabase.from('profiles').update({
      gender, age: parseInt(age), height_cm: parseInt(height), weight_kg: parseFloat(weight),
      activity: activityId, goal: goalId, goal_kcal: macros.target,
      goal_prot: macros.prot, goal_carbs: macros.carbs, goal_fat: macros.fat, onboarding_done: true,
    }).eq('id', user.id)
    setSaving(false)
    if (err) setError('Error al guardar. Inténtalo de nuevo.')
    else onComplete(macros)
  }

  if (step === 6) {
    const macros = calcCalories({ gender, age: parseInt(age), height: parseInt(height), weight: parseInt(weight), activityId, goalId })
    return (
      <div style={s.wrapper}>
        <div style={s.resultCard}>
          <span style={{fontSize:'40px'}}>🌿</span>
          <h2 style={{fontFamily:'Poppins,sans-serif',fontSize:'28px',fontWeight:700,color:'#1a2e23'}}>Tu plan está listo</h2>
          <p style={{fontSize:'14px',color:'#6b8c78'}}>Estas son tus metas diarias</p>
          <div style={s.resultGrid}>
            <div style={s.resultStat}><span style={s.resultNum}>{macros.target.toLocaleString('es-ES')}</span><span style={s.resultLbl}>kcal / día</span></div>
            <div style={s.resultStat}><span style={s.resultNum}>{macros.prot}g</span><span style={s.resultLbl}>proteína</span></div>
            <div style={s.resultStat}><span style={s.resultNum}>{macros.carbs}g</span><span style={s.resultLbl}>carbos</span></div>
            <div style={s.resultStat}><span style={s.resultNum}>{macros.fat}g</span><span style={s.resultLbl}>grasas</span></div>
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button style={s.ctaBtn} onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Empezar mi transformación →'}</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.wrapper}>
      <div style={s.logo}>vi<span style={{color:'#34c472'}}>tae</span></div>
      <div style={s.bar}><div style={{...s.barFill, width:`${Math.round((step/6)*100)}%`}}/></div>
      <p style={s.stepLabel}>Paso {step+1} de 6</p>

      <div style={s.card}>
        {step === 0 && <>
          <h2 style={s.question}>¿Cuál es tu sexo biológico?</h2>
          <p style={s.hint}>Lo usamos para calcular tu metabolismo con precisión.</p>
          <div style={s.optGrid}>
            <button style={gender==='male'?s.optSel:s.opt} onClick={()=>setGender('male')}><span style={{fontSize:'32px'}}>♂</span><span style={{color:'#1a2e23',fontWeight:600}}>Hombre</span></button>
            <button style={gender==='female'?s.optSel:s.opt} onClick={()=>setGender('female')}><span style={{fontSize:'32px'}}>♀</span><span style={{color:'#1a2e23',fontWeight:600}}>Mujer</span></button>
          </div>
        </>}

        {step === 1 && <>
          <h2 style={s.question}>¿Cuántos años tienes?</h2>
          <p style={s.hint}>Tu edad afecta a tu metabolismo.</p>
          <div style={s.numInput}>
            <button style={s.numBtn} onClick={()=>setAge(a=>Math.max(10,parseInt(a||0)-1))}>−</button>
            <div style={{display:'flex',alignItems:'baseline',gap:'8px'}}>
              <input type="number" value={age} onChange={e=>setAge(e.target.value)} style={s.numField} placeholder="25"/>
              <span style={s.numUnit}>años</span>
            </div>
            <button style={s.numBtn} onClick={()=>setAge(a=>Math.min(100,parseInt(a||0)+1))}>+</button>
          </div>
        </>}

        {step === 2 && <>
          <h2 style={s.question}>¿Cuánto mides?</h2>
          <p style={s.hint}>Tu altura en centímetros.</p>
          <div style={s.numInput}>
            <button style={s.numBtn} onClick={()=>setHeight(h=>Math.max(100,parseInt(h||0)-1))}>−</button>
            <div style={{display:'flex',alignItems:'baseline',gap:'8px'}}>
              <input type="number" value={height} onChange={e=>setHeight(e.target.value)} style={s.numField} placeholder="170"/>
              <span style={s.numUnit}>cm</span>
            </div>
            <button style={s.numBtn} onClick={()=>setHeight(h=>Math.min(250,parseInt(h||0)+1))}>+</button>
          </div>
        </>}

        {step === 3 && <>
          <h2 style={s.question}>¿Cuánto pesas?</h2>
          <p style={s.hint}>Tu peso actual en kilogramos.</p>
          <div style={s.numInput}>
            <button style={s.numBtn} onClick={()=>setWeight(w=>Math.max(30,parseFloat(w||0)-0.5).toFixed(1))}>−</button>
            <div style={{display:'flex',alignItems:'baseline',gap:'8px'}}>
              <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} style={s.numField} placeholder="70"/>
              <span style={s.numUnit}>kg</span>
            </div>
            <button style={s.numBtn} onClick={()=>setWeight(w=>Math.min(300,parseFloat(w||0)+0.5).toFixed(1))}>+</button>
          </div>
        </>}

        {step === 4 && <>
          <h2 style={s.question}>¿Nivel de actividad?</h2>
          <p style={s.hint}>Sé honesto/a para un cálculo preciso.</p>
          <div style={s.actList}>
            {ACTIVITY_LEVELS.map(a=>(
              <button key={a.id} style={activityId===a.id?s.actItemSel:s.actItem} onClick={()=>setActivityId(a.id)}>
                <div><p style={s.actLbl}>{a.label}</p><p style={s.actDesc}>{a.desc}</p></div>
                <div style={activityId===a.id?s.checkOn:s.check}>{activityId===a.id?'✓':''}</div>
              </button>
            ))}
          </div>
        </>}

        {step === 5 && <>
          <h2 style={s.question}>¿Cuál es tu objetivo?</h2>
          <p style={s.hint}>Ajustaremos tus calorías según tu meta.</p>
          <div style={s.goalGrid}>
            {GOALS.map(g=>(
              <button key={g.id} style={goalId===g.id?s.goalCardSel:s.goalCard} onClick={()=>setGoalId(g.id)}>
                <span style={{fontSize:'28px'}}>{g.icon}</span>
                <span style={{fontSize:'13px',color:'#1a2e23',fontWeight:600,textAlign:'center'}}>{g.label}</span>
              </button>
            ))}
          </div>
        </>}
      </div>

      <div style={s.navBtns}>
        {step > 0 && <button style={s.backBtn} onClick={()=>setStep(s=>s-1)}>← Atrás</button>}
        <button style={canContinue()?s.nextBtn:s.nextBtnDis} onClick={()=>setStep(s=>s+1)} disabled={!canContinue()}>
          {step===5?'Ver mi plan →':'Continuar →'}
        </button>
      </div>
    </div>
  )
}