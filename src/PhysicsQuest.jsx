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

  return <div>Physics Quest</div>
}
