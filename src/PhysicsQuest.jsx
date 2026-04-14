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
    x: 15,
    y: 60,
    tema: 'Movimiento Rectilíneo Uniforme',
    dificultad: 'Normal',
    preguntas: [],
  },
  {
    id: 2,
    x: 40,
    y: 35,
    tema: 'Leyes de Newton',
    dificultad: 'Maestro',
    preguntas: [],
  },
]

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function App() {
  return <div>Physics Quest</div>
}
