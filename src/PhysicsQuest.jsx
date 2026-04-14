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

  // --- Ref para el intervalo del timer ---
  const timerRef = useRef(null)

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

  return <div>Physics Quest</div>
}
