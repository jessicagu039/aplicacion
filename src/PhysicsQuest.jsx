import { useState, useEffect, useRef, useMemo } from 'react'

// ============================================================
// PALETA DE COLORES
// ============================================================
const COLORS = {
  bgPrimary:   '#0a0a1a',
  bgPanel:     '#1a1a2e',
  bgCard:      '#16213e',
  border:      '#0f3460',
  neonBlue:    '#00d4ff',
  neonGreen:   '#39ff14',
  neonGold:    '#ffd700',
  neonRed:     '#ff3366',
  neonPurple:  '#bf5fff',
  neonOrange:  '#ff6b35',
  textPrimary:   '#e2e8f0',
  textSecondary: '#94a3b8',
}

// ============================================================
// FUENTES
// ============================================================
const FONTS = {
  pixel:   "'Press Start 2P', cursive",
  dialog:  "'VT323', monospace",
}

// ============================================================
// ESCENAS (Máquina de Estados Finita)
// ============================================================
const SCENES = {
  INTRO:            'INTRO',
  WORLD_MAP:        'WORLD_MAP',
  QUESTION_BATTLE:  'QUESTION_BATTLE',
  RESULT_SCREEN:    'RESULT_SCREEN',
  FINAL_SCORE:      'FINAL_SCORE',
}

// ============================================================
// MISIONES
// ============================================================
const MISSIONS = [
  {
    id: 1,
    nombre: 'Valle de la Cinemática',
    x: 15,
    y: 60,
    tema: 'Movimiento Rectilíneo Uniforme',
    dificultad: 'Normal',
    color: '#00d4ff',
    icono: '🚀',
    preguntas: [
      {
        enunciado: 'Un automóvil viaja a 90 km/h durante 2 horas. ¿Cuál es la distancia recorrida?',
        opciones: ['45 km', '180 km', '360 km', '200 km'],
        correcta: 1,
        fallbackMessage: '¡Pilas! Usa d = v × t. Multiplica la velocidad (90 km/h) por el tiempo (2 h). El resultado es 180 km. ¡Sencillo cuando identificas las variables!',
      },
      {
        enunciado: 'Un tren recorre 450 km en 3 horas a velocidad constante. ¿Cuál es su velocidad?',
        opciones: ['200 km/h', '100 km/h', '150 km/h', '125 km/h'],
        correcta: 2,
        fallbackMessage: 'Vas por buen camino. Despeja la velocidad: v = d/t = 450 km ÷ 3 h = 150 km/h. En MRU siempre tienes d, v y t; con dos de ellas encuentras la tercera.',
      },
      {
        enunciado: 'Un ciclista pedalea a 20 m/s. ¿Cuánto tiempo tarda en recorrer 1 000 m?',
        opciones: ['100 s', '20 s', '40 s', '50 s'],
        correcta: 3,
        fallbackMessage: '¡Dale que se puede! Despeja el tiempo: t = d/v = 1 000 m ÷ 20 m/s = 50 s. Recuerda que las unidades deben ser coherentes antes de operar.',
      },
    ],
  },
  {
    id: 2,
    nombre: 'Montañas de Newton',
    x: 42,
    y: 32,
    tema: 'Leyes de Newton',
    dificultad: 'Normal',
    color: '#39ff14',
    icono: '⚖️',
    preguntas: [
      {
        enunciado: '¿Cuál es la fuerza neta necesaria para acelerar 5 kg a 4 m/s²?',
        opciones: ['10 N', '15 N', '20 N', '25 N'],
        correcta: 2,
        fallbackMessage: '¡Bacano intentarlo! Segunda Ley: F = m × a = 5 kg × 4 m/s² = 20 N. La masa va en kg y la aceleración en m/s² para obtener Newtons.',
      },
      {
        enunciado: 'Una fuerza de 60 N produce una aceleración de 3 m/s². ¿Cuál es la masa del objeto?',
        opciones: ['10 kg', '25 kg', '15 kg', '20 kg'],
        correcta: 3,
        fallbackMessage: '¡Pilas con el despeje! De F = ma se obtiene m = F/a = 60 N ÷ 3 m/s² = 20 kg. Identifica la incógnita y despeja antes de sustituir.',
      },
      {
        enunciado: '¿Cuál enunciado describe correctamente la Primera Ley de Newton?',
        opciones: [
          'F = m × a',
          'Acción y reacción son iguales y opuestas',
          'Todo cuerpo mantiene su estado si la fuerza neta es cero',
          'La fuerza es inversamente proporcional a la masa',
        ],
        correcta: 2,
        fallbackMessage: 'La Primera Ley o Ley de Inercia dice: un objeto en reposo o en MRU permanece así mientras la fuerza neta sobre él sea cero. ¡Eso es la inercia!',
      },
    ],
  },
  {
    id: 3,
    nombre: 'Lago de la Energía',
    x: 65,
    y: 58,
    tema: 'Trabajo y Energía',
    dificultad: 'Normal',
    color: '#ffd700',
    icono: '⚡',
    preguntas: [
      {
        enunciado: 'Se aplica una fuerza de 50 N para mover un objeto 10 m en la misma dirección. ¿Cuánto trabajo se realiza?',
        opciones: ['5 J', '250 J', '500 J', '100 J'],
        correcta: 2,
        fallbackMessage: '¡Bien pensado! W = F × d = 50 N × 10 m = 500 J. El trabajo solo se hace cuando la fuerza tiene componente en la dirección del desplazamiento.',
      },
      {
        enunciado: 'Un automóvil de 1 000 kg se mueve a 20 m/s. ¿Cuál es su energía cinética?',
        opciones: ['20 000 J', '100 000 J', '400 000 J', '200 000 J'],
        correcta: 3,
        fallbackMessage: 'Nota: Ec = ½ × m × v² = 0,5 × 1 000 × 400 = 200 000 J. ¡No olvides elevar al cuadrado la velocidad antes de multiplicar!',
      },
      {
        enunciado: 'Un objeto de 2 kg está a 5 m de altura (g = 10 m/s²). ¿Cuál es su energía potencial gravitacional?',
        opciones: ['20 J', '50 J', '10 J', '100 J'],
        correcta: 3,
        fallbackMessage: '¡Pilas! Ep = m × g × h = 2 kg × 10 m/s² × 5 m = 100 J. La energía potencial depende de la masa, la gravedad y la altura sobre el nivel de referencia.',
      },
    ],
  },
  {
    id: 4,
    nombre: 'Cavernas de las Ondas',
    x: 28,
    y: 78,
    tema: 'Ondas y Sonido',
    dificultad: 'Maestro',
    color: '#bf5fff',
    icono: '🌊',
    preguntas: [
      {
        enunciado: 'Una onda tiene frecuencia de 440 Hz y velocidad de 340 m/s. ¿Cuál es su longitud de onda?',
        opciones: ['1,30 m', '0,50 m', '0,77 m', '2,00 m'],
        correcta: 2,
        fallbackMessage: '¡Dale! λ = v / f = 340 m/s ÷ 440 Hz ≈ 0,77 m. La longitud de onda es la distancia entre dos crestas consecutivas. ¡Esa es la nota La!',
      },
      {
        enunciado: 'Si λ = 2 m y f = 5 Hz, ¿cuál es la velocidad de propagación de la onda?',
        opciones: ['2,5 m/s', '0,4 m/s', '7 m/s', '10 m/s'],
        correcta: 3,
        fallbackMessage: 'Vas por buen camino. v = λ × f = 2 m × 5 Hz = 10 m/s. Recuerda que esta relación es válida para cualquier tipo de onda periódica.',
      },
      {
        enunciado: '¿En qué tipo de onda las partículas vibran perpendicularmente a la dirección de propagación?',
        opciones: ['Onda longitudinal', 'Onda de presión', 'Onda estacionaria', 'Onda transversal'],
        correcta: 3,
        fallbackMessage: '¡Pilas con los conceptos! Las ondas transversales vibran en ángulo recto al avance (ej: cuerdas, luz). Las longitudinales vibran en la misma dirección (ej: sonido).',
      },
    ],
  },
  {
    id: 5,
    nombre: 'Torre de la Electricidad',
    x: 72,
    y: 22,
    tema: 'Electricidad Básica',
    dificultad: 'Maestro',
    color: '#ff6b35',
    icono: '🔋',
    preguntas: [
      {
        enunciado: 'Una resistencia de 10 Ω está conectada a 220 V. ¿Cuál es la corriente que circula?',
        opciones: ['22 000 A', '2 A', '22 A', '0,045 A'],
        correcta: 2,
        fallbackMessage: '¡Bacano! Ley de Ohm: I = V / R = 220 V ÷ 10 Ω = 22 A. Voltaje en voltios, resistencia en ohmios → corriente en amperios. ¡Tres variables, una ecuación!',
      },
      {
        enunciado: 'Una bombilla consume 60 W durante 2 horas. ¿Cuánta energía eléctrica consume en joules?',
        opciones: ['120 J', '432 000 J', '30 J', '720 J'],
        correcta: 1,
        fallbackMessage: '¡Pilas con las unidades! E = P × t = 60 W × 7 200 s = 432 000 J. Convierte primero las horas a segundos (2 h × 3 600 s/h) antes de operar.',
      },
      {
        enunciado: 'Dos resistencias de 6 Ω y 3 Ω están en paralelo. ¿Cuál es la resistencia equivalente?',
        opciones: ['9 Ω', '0,5 Ω', '2 Ω', '4,5 Ω'],
        correcta: 2,
        fallbackMessage: 'En paralelo: 1/Req = 1/R1 + 1/R2 = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 → Req = 2 Ω. En paralelo la resistencia equivalente SIEMPRE es menor que la menor individual.',
      },
    ],
  },
]

// ============================================================
// KEYFRAMES (inyectados una sola vez en <head>)
// ============================================================
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

  @keyframes pqBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pqFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pqPulse   {
    0%,100%{box-shadow:0 0 8px var(--mc),0 0 16px var(--mc)}
    50%{box-shadow:0 0 20px var(--mc),0 0 40px var(--mc)}
  }
  @keyframes pqWalk    { 0%,100%{transform:translateY(0) scaleX(1)} 50%{transform:translateY(-4px) scaleX(1)} }
  @keyframes pqAppear  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pqGlow    { 0%,100%{text-shadow:0 0 8px var(--gc)} 50%{text-shadow:0 0 24px var(--gc),0 0 48px var(--gc)} }
  @keyframes pqScan    { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a1a; font-family: 'VT323', monospace; min-height: 100vh; overflow-x: hidden; }

  .pq-btn {
    font-family: 'Press Start 2P', cursive;
    font-size: 9px;
    padding: 10px 18px;
    border: 2px solid;
    background: transparent;
    cursor: pointer;
    letter-spacing: 1px;
    transition: transform .1s, box-shadow .15s;
  }
  .pq-btn:hover  { transform: translateY(-2px); }
  .pq-btn:active { transform: translateY(1px); }
  .pq-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  .pq-btn-blue   { color:#00d4ff; border-color:#00d4ff; }
  .pq-btn-blue:not(:disabled):hover   { background:rgba(0,212,255,.12); box-shadow:0 0 20px rgba(0,212,255,.5); }
  .pq-btn-green  { color:#39ff14; border-color:#39ff14; }
  .pq-btn-green:not(:disabled):hover  { background:rgba(57,255,20,.12); box-shadow:0 0 20px rgba(57,255,20,.5); }
  .pq-btn-gold   { color:#ffd700; border-color:#ffd700; }
  .pq-btn-gold:not(:disabled):hover   { background:rgba(255,215,0,.12); box-shadow:0 0 20px rgba(255,215,0,.5); }
  .pq-btn-red    { color:#ff3366; border-color:#ff3366; }
  .pq-btn-red:not(:disabled):hover    { background:rgba(255,51,102,.12); box-shadow:0 0 20px rgba(255,51,102,.5); }
`

let _stylesInjected = false
function injectStyles() {
  if (_stylesInjected) return
  _stylesInjected = true
  const el = document.createElement('style')
  el.textContent = KEYFRAMES
  document.head.appendChild(el)
}

// ============================================================
// SUBCOMPONENTE: AIAssistant
// ============================================================
function AIAssistant({ message, state }) {
  // Efecto typewriter
  const [displayed, setDisplayed] = useState('')
  const twRef = useRef(null)

  useEffect(() => {
    clearInterval(twRef.current)
    setDisplayed('')
    if (!message) return
    let i = 0
    twRef.current = setInterval(() => {
      i++
      setDisplayed(message.slice(0, i))
      if (i >= message.length) clearInterval(twRef.current)
    }, 22)
    return () => clearInterval(twRef.current)
  }, [message])

  // Colores según estado
  const palette = {
    idle:      { main: '#00d4ff', glow: 'rgba(0,212,255,.35)',  label: 'PROF. NEWTON' },
    thinking:  { main: '#00d4ff', glow: 'rgba(0,212,255,.6)',   label: 'PROCESANDO…'  },
    correct:   { main: '#39ff14', glow: 'rgba(57,255,20,.45)',  label: '¡CORRECTO!'   },
    incorrect: { main: '#ffd700', glow: 'rgba(255,215,0,.45)',  label: 'INTÉNTALO'    },
    hint:      { main: '#bf5fff', glow: 'rgba(191,95,255,.45)', label: 'PISTA'        },
  }
  const { main, glow, label } = palette[state] ?? palette.idle

  // Avatar SVG — cambia color de relleno y ojos según estado
  const Avatar = () => (
    <svg width="56" height="64" viewBox="0 0 56 64" aria-hidden="true">
      {/* Cuerpo */}
      <rect x="14" y="32" width="28" height="22" rx="2" fill={main} opacity=".9"/>
      {/* Cabeza */}
      <rect x="11" y="9"  width="34" height="26" rx="4" fill={main}/>
      {/* Ojos */}
      <rect x="17" y="16" width="8"  height="8"  fill="#0a0a1a"/>
      <rect x="31" y="16" width="8"  height="8"  fill="#0a0a1a"/>
      {/* Pupilas */}
      <rect x="19" y="17" width="3" height="3" fill="white" opacity=".9"/>
      <rect x="33" y="17" width="3" height="3" fill="white" opacity=".9"/>
      {/* Boca */}
      {state === 'correct'
        ? <path d="M19 30 Q28 36 37 30" stroke="#0a0a1a" strokeWidth="2" fill="none"/>
        : state === 'incorrect'
          ? <path d="M19 34 Q28 29 37 34" stroke="#0a0a1a" strokeWidth="2" fill="none"/>
          : <rect x="20" y="30" width="16" height="3" rx="1" fill="#0a0a1a"/>
      }
      {/* Antena */}
      <rect x="26" y="1" width="4" height="10" fill={main}/>
      <circle cx="28" cy="2" r="4" fill={main}/>
      <circle cx="28" cy="2" r="2" fill="white"
        style={{ opacity: state === 'thinking' ? 1 : .4,
                 animation: state === 'thinking' ? 'pqBlink .55s infinite' : 'none' }}/>
      {/* Brazos */}
      <rect x="2"  y="35" width="12" height="5" rx="2" fill={main}/>
      <rect x="42" y="35" width="12" height="5" rx="2" fill={main}/>
      {/* Piernas */}
      <rect x="16" y="52" width="9"  height="10" rx="2" fill={main}/>
      <rect x="31" y="52" width="9"  height="10" rx="2" fill={main}/>
    </svg>
  )

  const panelStyle = {
    background: '#080d1a',
    border: `2px solid ${main}`,
    boxShadow: `0 0 18px ${glow}, inset 0 0 18px rgba(0,0,0,.5)`,
    padding: '14px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color .4s, box-shadow .4s',
    borderRadius: '3px',
  }

  const scanlineStyle = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 6px)',
    zIndex: 1,
  }

  const avatarWrapStyle = {
    flexShrink: 0,
    animation: state === 'thinking' ? 'pqFloat 1s ease-in-out infinite'
             : state === 'correct'  ? 'pqWalk .5s ease'
             : 'none',
  }

  const bubbleStyle = {
    flex: 1,
    background: '#11192e',
    border: `1px solid ${main}`,
    padding: '10px 12px',
    borderRadius: '2px 8px 8px 8px',
    position: 'relative',
    minHeight: '56px',
  }

  const arrowStyle = {
    position: 'absolute', left: '-9px', top: '10px',
    width: 0, height: 0,
    borderTop: '7px solid transparent',
    borderBottom: '7px solid transparent',
    borderRight: `9px solid ${main}`,
  }

  const textStyle = {
    fontFamily: FONTS.dialog,
    fontSize: '19px',
    lineHeight: '1.4',
    color: state === 'correct'   ? COLORS.neonGreen
         : state === 'incorrect' ? COLORS.neonGold
         : state === 'hint'      ? COLORS.neonPurple
         : COLORS.textPrimary,
    minHeight: '38px',
  }

  const cursorStyle = {
    display: 'inline-block',
    width: '10px', height: '18px',
    background: main,
    verticalAlign: 'text-bottom',
    marginLeft: '2px',
    animation: 'pqBlink .5s infinite',
  }

  const defaultMsg = 'Hola, soy el Profesor Newton. Selecciona una misión y ¡comencemos la aventura!'

  return (
    <div style={panelStyle}>
      <div style={scanlineStyle}/>
      <div style={{ display:'flex', gap:'14px', alignItems:'flex-start', position:'relative', zIndex:2 }}>

        {/* Avatar */}
        <div>
          <div style={avatarWrapStyle}><Avatar/></div>
          <p style={{
            fontFamily: FONTS.pixel, fontSize:'6px', color: main,
            textAlign:'center', marginTop:'4px',
            animation: state === 'thinking' ? 'pqBlink 1s infinite' : 'none',
          }}>
            {label}
          </p>
        </div>

        {/* Burbuja de diálogo */}
        <div style={bubbleStyle}>
          <div style={arrowStyle}/>
          <p style={textStyle}>
            {message ? displayed : <span style={{ color: COLORS.textSecondary }}>{defaultMsg}</span>}
            {message && displayed.length < message.length && <span style={cursorStyle}/>}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SUBCOMPONENTE: WorldMap
// ============================================================
function WorldMap({ missions, completedMissions, playerPos, onSelectMission }) {
  // Una misión está bloqueada si la anterior (en el array) no está completada
  function isLocked(idx) {
    if (idx === 0) return false
    return !completedMissions.includes(missions[idx - 1].id)
  }

  /* ── Fondo SVG del mapa ── */
  const MapBg = () => (
    <svg
      width="100%" height="100%"
      style={{ position:'absolute', inset:0, pointerEvents:'none' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100%" height="100%" fill="#080e1f"/>
      {/* Cadenas de montañas */}
      <polygon points="0,85% 12%,55% 24%,85%"  fill="#122040" opacity=".9"/>
      <polygon points="18%,85% 32%,42% 46%,85%" fill="#0f1a38" opacity=".9"/>
      <polygon points="58%,85% 70%,35% 82%,85%" fill="#122040" opacity=".9"/>
      {/* Lago central */}
      <ellipse cx="52%" cy="70%" rx="9%" ry="5%" fill="#093561" opacity=".75"/>
      <ellipse cx="52%" cy="70%" rx="7%" ry="3%" fill="#0b4a87" opacity=".5"/>
      {/* Árboles pixel */}
      {[8,13,18,23,78,83,88].map((x,i) => (
        <g key={i} transform={`translate(${x}%,74%)`}>
          <rect x="-3" y="8" width="6" height="8" fill="#0a3010"/>
          <polygon points="-10,8 0,-8 10,8"  fill="#0f4518"/>
          <polygon points="-7,2  0,-12 7,2"  fill="#145720"/>
        </g>
      ))}
      {/* Caminos entre nodos */}
      {[
        'M15%,60% Q28%,46% 42%,32%',
        'M42%,32% Q54%,42% 65%,58%',
        'M65%,58% Q68%,38% 72%,22%',
        'M15%,60% Q20%,70% 28%,78%',
      ].map((d,i) => (
        <path key={i} d={d}
          stroke="#ffd700" strokeWidth="2"
          strokeDasharray="7 5" fill="none" opacity=".5"/>
      ))}
      {/* Estrellas */}
      {Array.from({length:22},(_,i) => (
        <circle key={i}
          cx={`${(i*47+11)%100}%`} cy={`${(i*31+7)%100}%`}
          r="1.4" fill="white"
          opacity={.15 + (i%4)*.08}/>
      ))}
    </svg>
  )

  /* ── Avatar del jugador ── */
  const PlayerAvatar = () => (
    <svg width="28" height="36" viewBox="0 0 28 36" style={{ display:'block' }}>
      {/* Cuerpo */}
      <rect x="7" y="16" width="14" height="13" fill="#00d4ff"/>
      {/* Capa */}
      <polygon points="7,16 2,28 7,26"  fill="#bf5fff"/>
      <polygon points="21,16 26,28 21,26" fill="#bf5fff"/>
      {/* Cabeza */}
      <rect x="5" y="4" width="18" height="14" rx="3" fill="#ffd700"/>
      {/* Pelo */}
      <rect x="5" y="4" width="18" height="4" fill="#ff6b35"/>
      <rect x="3" y="5" width="4"  height="6" rx="2" fill="#ff6b35"/>
      {/* Ojos */}
      <rect x="8"  y="8" width="4" height="4" fill="#0a0a1a"/>
      <rect x="16" y="8" width="4" height="4" fill="#0a0a1a"/>
      {/* Brillo cabeza */}
      <rect x="8" y="5" width="6" height="3" fill="white" opacity=".25"/>
      {/* Piernas */}
      <rect x="8"  y="28" width="5" height="7" rx="2" fill="#00d4ff"/>
      <rect x="15" y="28" width="5" height="7" rx="2" fill="#00d4ff"/>
    </svg>
  )

  const containerStyle = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56%',   // ratio 16:9 aprox
    overflow: 'hidden',
    border: `2px solid ${COLORS.border}`,
    background: '#080e1f',
    minHeight: '260px',
  }

  return (
    <div style={containerStyle}>
      <MapBg/>

      {/* Nodos de misión */}
      {missions.map((m, idx) => {
        const locked   = isLocked(idx)
        const done     = completedMissions.includes(m.id)
        const nodeColor = done ? COLORS.neonGreen : locked ? '#3a3a5c' : m.color

        const nodeStyle = {
          position: 'absolute',
          left: `${m.x}%`, top: `${m.y}%`,
          transform: 'translate(-50%,-50%)',
          width: '46px', height: '46px',
          borderRadius: '50%',
          border: `3px solid ${nodeColor}`,
          background: done
            ? 'rgba(57,255,20,.15)'
            : locked ? '#1a1a2e'
            : 'rgba(0,0,0,.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: locked ? 'not-allowed' : 'pointer',
          transition: 'transform .25s, box-shadow .25s',
          boxShadow: locked ? 'none' : `0 0 14px ${nodeColor}66`,
          // CSS variable para pqPulse
          '--mc': nodeColor,
          animation: !done && !locked ? 'pqPulse 2.2s ease-in-out infinite' : 'none',
          zIndex: 4,
        }

        const labelStyle = {
          position: 'absolute',
          bottom: '-24px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONTS.pixel, fontSize: '6px',
          color: nodeColor,
          background: '#080d1a',
          border: `1px solid ${nodeColor}`,
          padding: '2px 5px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }

        return (
          <div
            key={m.id}
            style={nodeStyle}
            onClick={() => !locked && onSelectMission(m)}
            onMouseEnter={e => { if (!locked) e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.18)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)' }}
            title={locked ? `Misión bloqueada — completa "${missions[idx-1]?.nombre}" primero` : m.nombre}
          >
            <span style={{ fontSize:'18px', lineHeight:1 }}>
              {done ? '✓' : locked ? '🔒' : m.icono}
            </span>
            <span style={labelStyle}>M{m.id}</span>
          </div>
        )
      })}

      {/* Jugador — se mueve con transition */}
      <div style={{
        position: 'absolute',
        left: `${playerPos.x}%`, top: `${playerPos.y}%`,
        transform: 'translate(-50%,-100%)',
        transition: 'left 1.2s ease-in-out, top 1.2s ease-in-out',
        animation: 'pqFloat 2s ease-in-out infinite',
        zIndex: 8,
      }}>
        <PlayerAvatar/>
        {/* Sombra bajo el personaje */}
        <div style={{
          width:'20px', height:'5px',
          background:'rgba(0,0,0,.5)',
          borderRadius:'50%',
          margin:'2px auto 0',
          filter:'blur(2px)',
        }}/>
      </div>
    </div>
  )
}

// ============================================================
// ESCENA: INTRO
// ============================================================
function SceneIntro({ onStart }) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('gemini_api_key') || ''
  )

  function handleStart() {
    if (apiKey.trim()) localStorage.setItem('gemini_api_key', apiKey.trim())
    else localStorage.removeItem('gemini_api_key')
    onStart()
  }

  // Estilos reutilizables locales
  const logoLetter = (color, extra = {}) => ({
    fontFamily: FONTS.pixel,
    fontSize: 'clamp(14px, 3.5vw, 26px)',
    color,
    textShadow: `0 0 10px ${color}, 0 0 24px ${color}`,
    display: 'inline-block',
    ...extra,
  })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `radial-gradient(ellipse at 50% 40%, #0d1b3e 0%, ${COLORS.bgPrimary} 70%)`,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Fórmulas flotantes decorativas */}
      {['F=ma', 'v=d/t', 'λ=v/f', 'W=Fd', 'I=V/R', 'E=mc²'].map((f, i) => (
        <span key={i} aria-hidden="true" style={{
          position: 'absolute',
          fontFamily: FONTS.dialog,
          fontSize: '15px',
          color: 'rgba(0,212,255,.11)',
          left: `${(i * 17 + 5) % 92}%`,
          top: `${(i * 23 + 8) % 88}%`,
          transform: `rotate(${i * 22 - 44}deg)`,
          pointerEvents: 'none',
          animation: `pqFloat ${3 + i * .4}s ease-in-out infinite ${i * .6}s`,
        }}>{f}</span>
      ))}

      {/* Átomo animado */}
      <div style={{
        fontSize: '60px',
        marginBottom: '10px',
        animation: 'pqFloat 3s ease-in-out infinite',
        filter: 'drop-shadow(0 0 18px #00d4ff)',
      }}>⚛️</div>

      {/* Logo pixel: PHYSICS — letras individuales con glow azul */}
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '4px' }}>
        {'PHYSICS'.split('').map((ch, i) => (
          <span key={i} style={logoLetter(COLORS.neonBlue)}>{ch}</span>
        ))}
      </div>

      {/* Logo pixel: QUEST — letras con animación pqGlow dorada */}
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '10px' }}>
        {'QUEST'.split('').map((ch, i) => (
          <span key={i} style={logoLetter(COLORS.neonGold, {
            '--gc': COLORS.neonGold,
            animation: `pqGlow 2.2s ease-in-out infinite ${i * .12}s`,
          })}>{ch}</span>
        ))}
      </div>

      {/* Badge "RPG EDUCATIVO" */}
      <p style={{
        fontFamily: FONTS.pixel, fontSize: '9px',
        color: COLORS.neonGreen, letterSpacing: '4px',
        textShadow: `0 0 8px ${COLORS.neonGreen}`,
        marginBottom: '6px',
      }}>RPG EDUCATIVO</p>

      {/* Tagline */}
      <p style={{
        fontFamily: FONTS.dialog, fontSize: '19px',
        color: COLORS.textSecondary, letterSpacing: '2px',
        marginBottom: '28px',
      }}>Física · Grado 10° · Colombia</p>

      {/* Panel descripción + API key */}
      <div style={{
        background: COLORS.bgPanel,
        border: `2px solid ${COLORS.border}`,
        padding: '18px 22px',
        width: '100%', maxWidth: '440px',
        marginBottom: '24px',
        position: 'relative',
      }}>
        {/* Línea superior degradada */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${COLORS.neonBlue}, transparent)`,
        }}/>

        <p style={{
          fontFamily: FONTS.dialog, fontSize: '17px',
          color: COLORS.textPrimary, lineHeight: '1.5',
          marginBottom: '14px',
        }}>
          Embárcate en una aventura épica por el mundo de la física.
          Completa misiones y aprende con el Profesor Newton.
        </p>

        <label style={{
          fontFamily: FONTS.pixel, fontSize: '7px',
          color: COLORS.textSecondary, display: 'block', marginBottom: '6px',
        }}>🔑 GEMINI API KEY (OPCIONAL)</label>

        <input
          type="password"
          value={apiKey}
          placeholder="AIzaSy…"
          onChange={e => setApiKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          style={{
            width: '100%',
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textPrimary,
            fontFamily: FONTS.dialog, fontSize: '17px',
            padding: '8px 10px', outline: 'none',
          }}
        />

        <p style={{
          fontFamily: FONTS.dialog, fontSize: '14px',
          color: COLORS.textSecondary, marginTop: '6px',
        }}>
          Sin API key el juego usa retroalimentación predefinida.
          Con key activa el tutor IA en tiempo real.
        </p>
      </div>

      {/* Botón inicio con pqPulse */}
      <button
        className="pq-btn pq-btn-blue"
        onClick={handleStart}
        style={{
          fontSize: '11px', padding: '14px 28px',
          '--mc': COLORS.neonBlue,
          animation: 'pqPulse 2s ease-in-out infinite',
        }}
      >▶ INICIAR AVENTURA</button>

      <p style={{
        position: 'absolute', bottom: '10px',
        fontFamily: FONTS.pixel, fontSize: '6px',
        color: '#252545', textAlign: 'center',
      }}>REACT 18 · GEMINI 1.5 FLASH · PIXEL ART RPG</p>
    </div>
  )
}

// ============================================================
// ESCENA: RESULT_SCREEN
// ============================================================
function SceneResult({ mission, earnedPoints, totalScore, aiMessage, aiState, onContinue, allDone }) {
  const MAX_MISSION = 450   // 3 preguntas × 150 pts máx cada una
  const pct = mission ? Math.min(100, Math.round((earnedPoints / MAX_MISSION) * 100)) : 0

  const rank = pct === 100 ? { label: '¡PERFECTO!',          emoji: '🏆', color: COLORS.neonGold    }
    : pct >= 70            ? { label: '¡EXCELENTE!',          emoji: '⭐', color: COLORS.neonGreen   }
    : pct >= 40            ? { label: '¡BIEN HECHO!',         emoji: '👍', color: COLORS.neonBlue    }
    :                        { label: 'SIGUE PRACTICANDO',    emoji: '📚', color: COLORS.neonOrange  }

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bgPrimary,
      padding: '24px',
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      animation: 'pqAppear .6s ease-out',
    }}>

      {/* Encabezado con emoji y rango */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '52px',
          animation: 'pqFloat 2.5s ease-in-out infinite',
          filter: `drop-shadow(0 0 16px ${rank.color})`,
        }}>{rank.emoji}</div>

        <h1 style={{
          fontFamily: FONTS.pixel, fontSize: 'clamp(11px, 2.5vw, 15px)',
          color: rank.color, textShadow: `0 0 14px ${rank.color}`,
          marginTop: '8px',
          '--gc': rank.color, animation: 'pqGlow 2s infinite',
        }}>{rank.label}</h1>

        {mission && (
          <p style={{
            fontFamily: FONTS.dialog, fontSize: '19px',
            color: COLORS.textSecondary, marginTop: '6px',
          }}>{mission.icono} {mission.nombre} completada</p>
        )}
      </div>

      {/* Panel de puntos */}
      <div style={{
        background: COLORS.bgPanel,
        border: `2px solid ${rank.color}`,
        boxShadow: `0 0 24px ${rank.color}44`,
        padding: '20px 28px',
        width: '100%', maxWidth: '420px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)`,
        }}/>

        <p style={{ fontFamily: FONTS.pixel, fontSize: '7px', color: COLORS.textSecondary, marginBottom: '6px' }}>
          PUNTOS EN ESTA MISIÓN
        </p>

        {/* Puntos ganados — grande y brillante */}
        <p style={{
          fontFamily: FONTS.pixel, fontSize: '32px',
          color: COLORS.neonGold, textShadow: `0 0 20px ${COLORS.neonGold}`,
          '--gc': COLORS.neonGold, animation: 'pqGlow 2s infinite',
        }}>+{earnedPoints}</p>

        <p style={{ fontFamily: FONTS.dialog, fontSize: '16px', color: COLORS.textSecondary, marginTop: '4px' }}>
          {pct}% del máximo posible
        </p>

        {/* Barra de porcentaje */}
        <div style={{
          height: '8px', background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          margin: '12px 0', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})`,
            transition: 'width 1.2s ease',
            boxShadow: `0 0 6px ${rank.color}`,
          }}/>
        </div>

        <p style={{ fontFamily: FONTS.pixel, fontSize: '9px', color: COLORS.neonBlue }}>
          TOTAL ACUMULADO:&nbsp;
          <span style={{ color: COLORS.neonGold }}>{totalScore}</span> PTS
        </p>
      </div>

      {/* Asistente IA con el feedback de la última respuesta */}
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <AIAssistant message={aiMessage} state={aiState} />
      </div>

      {/* Botón continuar — etiqueta cambia si todas las misiones están completas */}
      <button
        className="pq-btn pq-btn-blue"
        onClick={onContinue}
        style={{ fontSize: '10px', padding: '13px 24px' }}
      >
        {allDone ? '🏆 VER RESULTADOS FINALES' : '▶ CONTINUAR AVENTURA'}
      </button>
    </div>
  )
}

// ============================================================
// ESCENA: FINAL_SCORE
// ============================================================
function SceneFinalScore({ missions, completedMissions, missionScores, totalScore, onRestart }) {
  const MAX_MISSION = 450              // máx por misión
  const MAX_TOTAL   = missions.length * MAX_MISSION
  const totalPct    = MAX_TOTAL > 0 ? Math.round((totalScore / MAX_TOTAL) * 100) : 0

  const rank = totalPct >= 90 ? { label: 'MAESTRO DE LA FÍSICA',   emoji: '🏆', color: COLORS.neonGold   }
    : totalPct >= 70          ? { label: 'FÍSICO EXPERTO',          emoji: '⭐', color: COLORS.neonGreen  }
    : totalPct >= 50          ? { label: 'EXPLORADOR CIENTÍFICO',   emoji: '🔭', color: COLORS.neonBlue   }
    :                           { label: 'APRENDIZ DE LA FÍSICA',   emoji: '📚', color: COLORS.neonOrange }

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 50% 20%, #0d1b3e 0%, ${COLORS.bgPrimary} 65%)`,
      padding: '24px',
      maxWidth: '780px',
      margin: '0 auto',
      animation: 'pqAppear .6s ease-out',
    }}>

      {/* Encabezado épico */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          fontSize: '58px',
          animation: 'pqFloat 3s ease-in-out infinite',
          filter: `drop-shadow(0 0 20px ${rank.color})`,
        }}>{rank.emoji}</div>

        <h1 style={{
          fontFamily: FONTS.pixel,
          fontSize: 'clamp(10px, 2.5vw, 16px)',
          color: rank.color,
          textShadow: `0 0 16px ${rank.color}`,
          lineHeight: '1.6',
          marginTop: '10px',
          '--gc': rank.color,
          animation: 'pqGlow 2.5s infinite',
        }}>{rank.label}</h1>

        <p style={{
          fontFamily: FONTS.dialog, fontSize: '19px',
          color: COLORS.textSecondary, marginTop: '6px',
        }}>Aventura completada · Resumen de desempeño</p>
      </div>

      {/* Puntuación total */}
      <div style={{
        background: COLORS.bgPanel,
        border: `3px solid ${rank.color}`,
        boxShadow: `0 0 32px ${rank.color}44`,
        padding: '20px',
        textAlign: 'center',
        marginBottom: '24px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)`,
        }}/>

        <p style={{ fontFamily: FONTS.pixel, fontSize: '7px', color: COLORS.textSecondary, marginBottom: '8px' }}>
          PUNTAJE TOTAL
        </p>

        <p style={{
          fontFamily: FONTS.pixel, fontSize: '36px',
          color: COLORS.neonGold, textShadow: `0 0 24px ${COLORS.neonGold}`,
          '--gc': COLORS.neonGold, animation: 'pqGlow 2s infinite',
        }}>{totalScore}</p>

        <p style={{ fontFamily: FONTS.dialog, fontSize: '17px', color: COLORS.textSecondary, marginTop: '4px' }}>
          {totalPct}% del máximo · {completedMissions.length}/{missions.length} misiones completadas
        </p>

        {/* Barra global de progreso */}
        <div style={{
          height: '10px', background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          margin: '14px 0 0', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${totalPct}%`,
            background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})`,
            transition: 'width 1.4s ease',
            boxShadow: `0 0 8px ${rank.color}`,
          }}/>
        </div>
      </div>

      {/* Gráfico de barras CSS — rendimiento por misión */}
      <div style={{
        background: COLORS.bgPanel,
        border: `2px solid ${COLORS.border}`,
        padding: '20px',
        marginBottom: '24px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${COLORS.neonBlue}, transparent)`,
        }}/>

        <h2 style={{ fontFamily: FONTS.pixel, fontSize: '9px', color: COLORS.neonBlue, marginBottom: '18px' }}>
          📊 RENDIMIENTO POR MISIÓN
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {missions.map(m => {
            const earned = missionScores[m.id] ?? 0
            const done   = completedMissions.includes(m.id)
            const barPct = done ? Math.round((earned / MAX_MISSION) * 100) : 0

            return (
              <div key={m.id}>
                {/* Etiqueta de la misión */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontFamily: FONTS.pixel, fontSize: '7px', color: done ? m.color : COLORS.textSecondary }}>
                    {m.icono} {m.nombre}
                  </span>
                  <span style={{ fontFamily: FONTS.dialog, fontSize: '16px', color: done ? COLORS.neonGold : COLORS.textSecondary }}>
                    {done ? `${earned} / ${MAX_MISSION} pts` : 'NO COMPLETADA'}
                  </span>
                </div>

                {/* Barra CSS con transición */}
                <div style={{
                  height: '16px', background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${m.color}77, ${m.color})`,
                    boxShadow: `0 0 8px ${m.color}`,
                    transition: 'width 1.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '5px',
                  }}>
                    {/* Porcentaje dentro de la barra si hay espacio */}
                    {barPct > 18 && (
                      <span style={{ fontFamily: FONTS.pixel, fontSize: '6px', color: '#0a0a1a' }}>
                        {barPct}%
                      </span>
                    )}
                  </div>
                  {/* Porcentaje fuera de la barra si es muy corta */}
                  {done && barPct <= 18 && (
                    <span style={{
                      position: 'absolute', left: '6px', top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: FONTS.pixel, fontSize: '6px', color: m.color,
                    }}>{barPct}%</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Botón reiniciar */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="pq-btn pq-btn-blue"
          onClick={onRestart}
          style={{ fontSize: '10px', padding: '13px 24px' }}
        >🔄 NUEVA AVENTURA</button>

        <p style={{ fontFamily: FONTS.pixel, fontSize: '6px', color: '#252545', marginTop: '20px' }}>
          PHYSICS QUEST RPG · EDUCACIÓN FÍSICA GRADO 10° · COLOMBIA
        </p>
      </div>
    </div>
  )
}

// ============================================================
// ESCENA: WORLD_MAP
// ============================================================
function SceneWorldMap({ missions, completedMissions, playerPos, score, onSelectMission, onViewFinalScore }) {
  const allDone = completedMissions.length === missions.length

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgPrimary, padding: '20px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontFamily: FONTS.pixel, fontSize: '13px', color: COLORS.neonBlue, textShadow: `0 0 10px ${COLORS.neonBlue}`, marginBottom: '4px' }}>
            MAPA DEL MUNDO
          </h1>
          <p style={{ fontFamily: FONTS.dialog, fontSize: '16px', color: COLORS.textSecondary }}>
            Selecciona una misión para iniciar el duelo
          </p>
        </div>
        <div style={{ fontFamily: FONTS.pixel, fontSize: '11px', color: COLORS.neonGold, textShadow: `0 0 10px ${COLORS.neonGold}`, background: COLORS.bgPanel, border: `2px solid ${COLORS.neonGold}`, padding: '8px 14px' }}>
          ⭐ {score} PTS
        </div>
      </div>

      {/* Mapa interactivo con nodos y personaje animado */}
      <div style={{ marginBottom: '16px' }}>
        <WorldMap
          missions={missions}
          completedMissions={completedMissions}
          playerPos={playerPos}
          onSelectMission={onSelectMission}
        />
      </div>

      {/* Leyenda de misiones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {missions.map((m, idx) => {
          const done    = completedMissions.includes(m.id)
          const blocked = idx > 0 && !completedMissions.includes(missions[idx - 1].id)
          return (
            <div
              key={m.id}
              onClick={() => !blocked && onSelectMission(m)}
              style={{
                background: COLORS.bgPanel,
                border: `2px solid ${done ? COLORS.neonGreen : blocked ? COLORS.border : m.color}`,
                padding: '10px 14px',
                cursor: blocked ? 'not-allowed' : 'pointer',
                opacity: blocked ? .5 : 1,
                transition: 'box-shadow .25s',
              }}
              onMouseEnter={e => { if (!blocked) e.currentTarget.style.boxShadow = `0 0 14px ${m.color}55` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              <p style={{ fontFamily: FONTS.pixel, fontSize: '7px', color: done ? COLORS.neonGreen : blocked ? COLORS.textSecondary : m.color, marginBottom: '4px' }}>
                {m.icono} {m.nombre}
              </p>
              <p style={{ fontFamily: FONTS.dialog, fontSize: '15px', color: COLORS.textSecondary, marginBottom: '6px' }}>
                {m.tema}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONTS.pixel, fontSize: '6px', color: m.dificultad === 'Maestro' ? COLORS.neonRed : COLORS.neonGold, border: `1px solid ${m.dificultad === 'Maestro' ? COLORS.neonRed : COLORS.neonGold}`, padding: '2px 5px' }}>
                  {m.dificultad}
                </span>
                {done    && <span style={{ fontFamily: FONTS.pixel, fontSize: '8px', color: COLORS.neonGreen }}>✓ COMPLETADA</span>}
                {blocked && <span style={{ fontFamily: FONTS.dialog, fontSize: '14px', color: COLORS.textSecondary }}>🔒 Bloqueada</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Barra de progreso global */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.pixel, fontSize: '7px', color: COLORS.textSecondary, marginBottom: '5px' }}>
          <span>PROGRESO TOTAL</span>
          <span style={{ color: COLORS.neonBlue }}>{completedMissions.length}/{missions.length} MISIONES</span>
        </div>
        <div style={{ height: '8px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(completedMissions.length / missions.length) * 100}%`, background: `linear-gradient(90deg,${COLORS.neonBlue}88,${COLORS.neonBlue})`, transition: 'width .8s ease', boxShadow: `0 0 6px ${COLORS.neonBlue}` }}/>
        </div>
      </div>

      {/* Botón de resultados finales — aparece solo cuando todo está completo */}
      {allDone && (
        <div style={{ textAlign: 'center', animation: 'pqAppear .5s ease-out' }}>
          <button
            className="pq-btn pq-btn-gold"
            onClick={onViewFinalScore}
            style={{ fontSize: '10px', padding: '13px 24px', '--mc': COLORS.neonGold, animation: 'pqPulse 2s infinite' }}
          >
            🏆 VER RESULTADOS FINALES
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ESCENA: QUESTION_BATTLE
// ============================================================
function SceneQuestionBattle({
  mission, questionIndex, timer, score, attempts, hintsUsed,
  aiMessage, aiState,
  onAnswer, onHint, onNextQuestion, onSurrender,
}) {
  // pickedIdx: opción seleccionada en el intento en curso.
  // El componente se remonta con key={questionIndex} en App(), reseteando este estado.
  const [pickedIdx, setPickedIdx] = useState(null)

  const q       = mission.preguntas[questionIndex]
  const totalQ  = mission.preguntas.length
  const isLast  = questionIndex === totalQ - 1
  const penalty = mission.dificultad === 'Maestro' ? 25 : 10

  const isAnswered = aiState === 'correct' || attempts >= 3
  const canAnswer  = !isAnswered && aiState !== 'thinking'

  // Color del timer según urgencia
  const timerColor = timer <= 15 ? COLORS.neonGreen
    : timer <= 30 ? COLORS.neonGold
    : COLORS.neonRed

  const LABELS = ['A', 'B', 'C', 'D']

  function handleOptionClick(idx) {
    if (!canAnswer) return
    setPickedIdx(idx)
    onAnswer(idx)
  }

  // Borde de cada opción según resultado
  function optionBorder(idx) {
    if (idx === pickedIdx) {
      if (aiState === 'thinking')  return COLORS.neonBlue
      if (aiState === 'correct')   return COLORS.neonGreen
      if (aiState === 'incorrect') return COLORS.neonRed
    }
    if (attempts >= 3 && idx === q.correcta) return COLORS.neonGreen   // revelar tras 3 fallos
    return COLORS.border
  }

  // Fondo de cada opción según resultado
  function optionBg(idx) {
    if (idx === pickedIdx) {
      if (aiState === 'thinking')  return 'rgba(0,212,255,.07)'
      if (aiState === 'correct')   return 'rgba(57,255,20,.08)'
      if (aiState === 'incorrect') return 'rgba(255,51,102,.08)'
    }
    if (attempts >= 3 && idx === q.correcta) return 'rgba(57,255,20,.08)'
    return 'transparent'
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgPrimary, padding: '16px', maxWidth: '860px', margin: '0 auto' }}>

      {/* ── HEADER ── nombre de misión + métricas */}
      <div style={{
        background: COLORS.bgPanel,
        border: `2px solid ${mission.color}`,
        boxShadow: `0 0 18px ${mission.color}44`,
        padding: '10px 16px',
        marginBottom: '14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${mission.color},transparent)` }}/>

        <div>
          <p style={{ fontFamily: FONTS.pixel, fontSize: '8px', color: mission.color, marginBottom: '2px' }}>
            {mission.icono} {mission.nombre}
          </p>
          <p style={{ fontFamily: FONTS.dialog, fontSize: '15px', color: COLORS.textSecondary }}>
            {mission.tema}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: FONTS.pixel, fontSize: '13px', color: timerColor, textShadow: `0 0 8px ${timerColor}` }}>
            ⏱ {timer}s
          </span>
          <span style={{ fontFamily: FONTS.pixel, fontSize: '9px', color: COLORS.neonGold }}>
            ⭐ {score}
          </span>
          <span style={{ fontFamily: FONTS.pixel, fontSize: '9px', color: attempts > 0 ? COLORS.neonRed : COLORS.textSecondary }}>
            ✗ {attempts}/3
          </span>
        </div>
      </div>

      {/* ── BARRA DE PROGRESO DE PREGUNTA ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.pixel, fontSize: '7px', color: COLORS.textSecondary, marginBottom: '4px' }}>
          <span>PREGUNTA</span>
          <span style={{ color: mission.color }}>{questionIndex + 1} / {totalQ}</span>
        </div>
        <div style={{ height: '6px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((questionIndex + 1) / totalQ) * 100}%`, background: `linear-gradient(90deg,${mission.color}88,${mission.color})`, transition: 'width .5s ease' }}/>
        </div>
      </div>

      {/* ── ENUNCIADO ── */}
      <div style={{
        background: COLORS.bgPanel,
        border: `2px solid ${COLORS.border}`,
        padding: '18px 20px',
        marginBottom: '14px',
        position: 'relative',
        animation: 'pqAppear .4s ease-out',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${mission.color},transparent)` }}/>
        <p style={{ fontFamily: FONTS.dialog, fontSize: '22px', color: COLORS.textPrimary, lineHeight: '1.5' }}>
          {q.enunciado}
        </p>
      </div>

      {/* ── OPCIONES DE RESPUESTA ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px', marginBottom: '14px' }}>
        {q.opciones.map((texto, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(idx)}
            disabled={!canAnswer}
            style={{
              background: optionBg(idx),
              border: `2px solid ${optionBorder(idx)}`,
              color: optionBorder(idx) === COLORS.border ? COLORS.textPrimary : optionBorder(idx),
              padding: '12px 15px',
              cursor: canAnswer ? 'pointer' : 'default',
              fontFamily: FONTS.dialog,
              fontSize: '19px',
              textAlign: 'left',
              display: 'flex', gap: '10px', alignItems: 'center',
              transition: 'background .15s, border-color .15s',
            }}
            onMouseEnter={e => {
              if (!canAnswer) return
              e.currentTarget.style.background   = 'rgba(0,212,255,.08)'
              e.currentTarget.style.borderColor  = COLORS.neonBlue
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = optionBg(idx)
              e.currentTarget.style.borderColor = optionBorder(idx)
            }}
          >
            <span style={{ fontFamily: FONTS.pixel, fontSize: '9px', color: optionBorder(idx), minWidth: '16px' }}>
              {LABELS[idx]}
            </span>
            {texto}
          </button>
        ))}
      </div>

      {/* ── BOTONES DE ACCIÓN ── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' }}>

        {/* Pedir pista — penalización según dificultad */}
        {!isAnswered && (
          <button
            className="pq-btn pq-btn-gold"
            onClick={onHint}
            disabled={aiState === 'thinking'}
            style={{ fontSize: '8px' }}
          >
            💡 PEDIR PISTA (−{penalty} pts)
          </button>
        )}

        {/* Siguiente / Terminar — aparece tras responder o agotar intentos */}
        {isAnswered && (
          <button
            className="pq-btn pq-btn-green"
            onClick={onNextQuestion}
            style={{ fontSize: '9px', padding: '11px 20px' }}
          >
            {isLast ? '🏁 TERMINAR MISIÓN' : '► SIGUIENTE PREGUNTA'}
          </button>
        )}

        {/* Rendirse — disponible mientras la pregunta no esté resuelta */}
        {!isAnswered && (
          <button
            className="pq-btn pq-btn-red"
            onClick={onSurrender}
            disabled={aiState === 'thinking'}
            style={{ fontSize: '8px', marginLeft: 'auto' }}
          >
            🏳 RENDIRSE
          </button>
        )}
      </div>

      {/* ── ASISTENTE IA ── feedback en tiempo real */}
      <AIAssistant message={aiMessage} state={aiState} />
    </div>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function App() {
  // --- Máquina de estados (FSM) ---
  const [currentScene, setCurrentScene] = useState(SCENES.INTRO)

  // --- Misión y pregunta activas ---
  const [selectedMission, setSelectedMission] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // --- Puntuación y métricas ---
  const [score, setScore]               = useState(0)
  const [attempts, setAttempts]         = useState(0)
  const [hintsUsed, setHintsUsed]       = useState(0)
  const [timer, setTimer]               = useState(0)

  // --- Asistente IA ---
  const [aiMessage, setAiMessage] = useState('')
  const [aiState, setAiState]     = useState('idle') // idle | thinking | correct | incorrect | hint

  // --- Mapa y progreso ---
  const [playerPos, setPlayerPos]               = useState({ x: 10, y: 90 })
  const [completedMissions, setCompletedMissions] = useState([])

  // --- Puntuación por misión (para dashboard final) ---
  const [earnedThisMission, setEarnedThisMission] = useState(0)
  const [missionScores, setMissionScores]         = useState({})  // { [missionId]: points }

  // --- Ref para el intervalo del timer ---
  const timerRef = useRef(null)
  // --- Ref para el timeout de transición al seleccionar misión ---
  const selectTimerRef = useRef(null)

  // ============================================================
  // EFECTO: inyectar estilos y fuentes una sola vez
  // ============================================================
  useEffect(() => { injectStyles() }, [])

  // ============================================================
  // EFECTO: temporizador activo solo en QUESTION_BATTLE
  // ============================================================
  useEffect(() => {
    if (currentScene === SCENES.QUESTION_BATTLE) {
      setTimer(0)
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [currentScene, currentQuestion])

  // ============================================================
  // callGeminiAPI — wrapper fetch a Google AI Studio
  // ============================================================
  async function callGeminiAPI(pregunta, respuestaUsuario, tema, esCorrecta) {
    const apiKey = localStorage.getItem('gemini_api_key') || ''

    // Sin clave → fallback inmediato
    if (!apiKey) {
      const q = selectedMission?.preguntas[currentQuestion]
      return q?.fallbackMessage ?? 'Revisa la teoría del tema y vuelve a intentarlo. ¡Tú puedes!'
    }

    const systemPrompt =
      'Eres un tutor de física experto en Colombia. ' +
      'Tu tono es motivador y pedagógico, usando expresiones locales sutiles ' +
      "(ej: '¡Pilas!', 'Vas por buen camino', '¡Bacano!', '¡Nota!'). " +
      'Máximo 4 oraciones por respuesta. No uses markdown.'

    const userPrompt =
      `Tema: "${tema}"\n` +
      `Pregunta: "${pregunta}"\n` +
      `Respuesta del estudiante: "${respuestaUsuario}"\n` +
      `¿Es correcta?: ${esCorrecta ? 'SÍ' : 'NO'}\n` +
      'Proporciona retroalimentación formativa breve y motivadora en español.'

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
          }),
        }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? _fallback(esCorrecta)
    } catch {
      return _fallback(esCorrecta)
    }
  }

  // Fallback local cuando la API falla
  function _fallback(esCorrecta) {
    const q = selectedMission?.preguntas[currentQuestion]
    if (q?.fallbackMessage) return q.fallbackMessage
    return esCorrecta
      ? '¡Excelente! Respuesta correcta. ¡Sigue así!'
      : '¡Pilas! Respuesta incorrecta. Revisa la fórmula y vuelve a intentarlo.'
  }

  // ============================================================
  // calculateScore — puntuación decreciente + time bonus
  // ============================================================
  function calculateScore(attemptsUsed, hintsUsedCount, timeElapsed) {
    // Puntuación base según número de intento en que acertó
    const baseByAttempt = { 1: 100, 2: 60, 3: 30 }
    const base = baseByAttempt[Math.min(attemptsUsed, 3)] ?? 0

    // Penalización por pistas según dificultad
    const hintPenalty = hintsUsedCount * (selectedMission?.dificultad === 'Maestro' ? 25 : 10)

    // Bonus por rapidez (≤ 30 s)
    const timeBonus = timeElapsed <= 30 ? 50 : 0

    return Math.max(0, base - hintPenalty + timeBonus)
  }

  // ============================================================
  // handleAnswer — valida opción, llama a Gemini, actualiza score
  // ============================================================
  async function handleAnswer(optionIndex) {
    if (aiState === 'thinking') return          // evita doble clic
    const q       = selectedMission.preguntas[currentQuestion]
    const esCorr  = optionIndex === q.correcta
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    setAiState('thinking')
    setAiMessage('')

    const mensaje = await callGeminiAPI(
      q.enunciado,
      q.opciones[optionIndex],
      selectedMission.tema,
      esCorr
    )
    setAiMessage(mensaje)
    setAiState(esCorr ? 'correct' : 'incorrect')

    if (esCorr) {
      const earned = calculateScore(newAttempts, hintsUsed, timer)
      setScore(prev => prev + earned)
      setEarnedThisMission(prev => prev + earned)
    }
  }

  // ============================================================
  // handleHint — pide pista a Gemini y aplica penalización
  // ============================================================
  async function handleHint() {
    if (aiState === 'thinking') return
    const q           = selectedMission.preguntas[currentQuestion]
    const newHints    = hintsUsed + 1
    setHintsUsed(newHints)

    setAiState('thinking')
    setAiMessage('')

    const apiKey = localStorage.getItem('gemini_api_key') || ''
    let pista

    if (apiKey) {
      const systemPrompt =
        'Eres un tutor de física colombiano. Da una pista pedagógica SIN revelar ' +
        "la respuesta directa. Usa expresiones locales ('¡Pilas!', 'Dale que se puede'). " +
        'Máximo 3 oraciones. No uses markdown.'
      const userPrompt =
        `Da una pista para esta pregunta de "${selectedMission.tema}": "${q.enunciado}". ` +
        'No des la respuesta directa.'
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: { temperature: 0.8, maxOutputTokens: 150 },
            }),
          }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        pista = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      } catch {
        pista = null
      }
    }

    // Fallback si la API no responde o no hay clave
    if (!pista) {
      pista = q.fallbackMessage ?? '¡Pilas! Revisa las fórmulas del tema y vuelve a intentarlo.'
    }

    const penalty = selectedMission.dificultad === 'Maestro' ? 25 : 10
    setAiMessage(`💡 PISTA (−${penalty} pts): ${pista}`)
    setAiState('hint')
  }

  // ============================================================
  // NAVEGACIÓN — handlers de transición entre escenas
  // ============================================================
  function handleStartGame() {
    setCurrentScene(SCENES.WORLD_MAP)
  }

  function handleSelectMission(mission) {
    // Mueve el sprite en el mapa (transition CSS 1.2s) antes de cambiar escena
    setPlayerPos({ x: mission.x, y: mission.y })
    clearTimeout(selectTimerRef.current)
    selectTimerRef.current = setTimeout(() => {
      setSelectedMission(mission)
      setCurrentQuestion(0)
      setAttempts(0)
      setHintsUsed(0)
      setEarnedThisMission(0)
      setAiMessage('')
      setAiState('idle')
      setCurrentScene(SCENES.QUESTION_BATTLE)
    }, 1300)
  }

  function handleFinishMission() {
    setCompletedMissions(prev =>
      prev.includes(selectedMission.id) ? prev : [...prev, selectedMission.id]
    )
    setMissionScores(prev => ({ ...prev, [selectedMission.id]: earnedThisMission }))
    setCurrentScene(SCENES.RESULT_SCREEN)
  }

  function handleNextQuestion() {
    if (currentQuestion < selectedMission.preguntas.length - 1) {
      // Avanza a la siguiente pregunta y resetea métricas por pregunta
      setCurrentQuestion(prev => prev + 1)
      setAttempts(0)
      setHintsUsed(0)
      setAiMessage('')
      setAiState('idle')
    } else {
      // Era la última pregunta → finalizar misión
      handleFinishMission()
    }
  }

  function handleSurrender() {
    // Termina la misión con los puntos acumulados hasta el momento
    handleFinishMission()
  }

  function handleContinueFromResult() {
    const allDone = MISSIONS.every(m => completedMissions.includes(m.id))
    setCurrentScene(allDone ? SCENES.FINAL_SCORE : SCENES.WORLD_MAP)
  }

  function handleRestart() {
    setCurrentScene(SCENES.INTRO)
    setSelectedMission(null)
    setCurrentQuestion(0)
    setScore(0)
    setAttempts(0)
    setHintsUsed(0)
    setTimer(0)
    setAiMessage('')
    setAiState('idle')
    setPlayerPos({ x: 10, y: 90 })
    setCompletedMissions([])
    setEarnedThisMission(0)
    setMissionScores({})
  }

  // ============================================================
  // RENDER — FSM de escenas
  // ============================================================
  if (currentScene === SCENES.INTRO)
    return <SceneIntro onStart={handleStartGame} />

  if (currentScene === SCENES.RESULT_SCREEN) {
    const allDone = MISSIONS.every(m => completedMissions.includes(m.id))
    return (
      <SceneResult
        mission={selectedMission}
        earnedPoints={earnedThisMission}
        totalScore={score}
        aiMessage={aiMessage}
        aiState={aiState}
        onContinue={handleContinueFromResult}
        allDone={allDone}
      />
    )
  }

  if (currentScene === SCENES.FINAL_SCORE)
    return (
      <SceneFinalScore
        missions={MISSIONS}
        completedMissions={completedMissions}
        missionScores={missionScores}
        totalScore={score}
        onRestart={handleRestart}
      />
    )

  if (currentScene === SCENES.WORLD_MAP)
    return (
      <SceneWorldMap
        missions={MISSIONS}
        completedMissions={completedMissions}
        playerPos={playerPos}
        score={score}
        onSelectMission={handleSelectMission}
        onViewFinalScore={() => setCurrentScene(SCENES.FINAL_SCORE)}
      />
    )

  if (currentScene === SCENES.QUESTION_BATTLE && selectedMission)
    return (
      // key={currentQuestion} remonta el componente en cada pregunta,
      // reseteando pickedIdx y la animación del enunciado
      <SceneQuestionBattle
        key={currentQuestion}
        mission={selectedMission}
        questionIndex={currentQuestion}
        timer={timer}
        score={score}
        attempts={attempts}
        hintsUsed={hintsUsed}
        aiMessage={aiMessage}
        aiState={aiState}
        onAnswer={handleAnswer}
        onHint={handleHint}
        onNextQuestion={handleNextQuestion}
        onSurrender={handleSurrender}
      />
    )

  // Fallback de seguridad (no debería alcanzarse)
  return (
    <div style={{ color: COLORS.textPrimary, padding: '40px', fontFamily: FONTS.dialog, fontSize: '22px', background: COLORS.bgPrimary, minHeight: '100vh' }}>
      Escena desconocida: <strong style={{ color: COLORS.neonRed }}>{currentScene}</strong>
    </div>
  )
}
