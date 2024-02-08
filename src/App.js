import Board from './components/Board'
import './css/board.css'
function App() {
  return (
    <div className='App'>
      <div className='outerBoard'>
        <h1>Tic Tac Toe</h1>
        <Board></Board>
      </div>
    </div>
  )
}

export default App
