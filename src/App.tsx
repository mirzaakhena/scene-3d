import Scene from './components/Scene'
import './App.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Scene />
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '13px',
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        drag to rotate · scroll to zoom · right-click to pan
      </div>
    </div>
  )
}

export default App
