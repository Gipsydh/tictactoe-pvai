import { useState } from 'react'
import Box from './Box'
const mat = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

let player
let opponent
let winPlayer = null
let decision
const Board = () => {
  const [flag, setflag] = useState(false)
  const [flag2, setflag2] = useState(false)
  const [showChoose, setshowChoose] = useState(false)
  const [squares, setSquares] = useState(mat)
  const [openBoard, setOpenBoard] = useState(false)
  const [chooseModeFlag, setChooseModeFlag] = useState(false)
  const [modeDecision, setModeDecision] = useState('')
  const [count, setCount] = useState(0)
  const [difficulty, setDifficulty] = useState('')
  const [randomMove, setRandomMove] = useState(0)
  const checkState = (mat) => {
    for (let i = 0; i < mat.length; i++) {
      if (mat[i][0] !== null) {
        if (mat[i][0] === mat[i][1] && mat[i][1] === mat[i][2]) {
          winPlayer = mat[i][0]
          return true
        }
      }
    }
    for (let i = 0; i < mat.length; i++) {
      if (mat[0][i] !== null) {
        if (mat[0][i] === mat[1][i] && mat[1][i] === mat[2][i]) {
          winPlayer = mat[0][i]
          return true
        }
      }
    }
    if (mat[0][0] !== null)
      if (mat[0][0] === mat[1][1] && mat[1][1] === mat[2][2]) {
        winPlayer = mat[0][0]
        return true
      }
    if (mat[0][2])
      if (mat[0][2] === mat[1][1] && mat[1][1] === mat[2][0]) {
        winPlayer = mat[0][2]
        return true
      }
    return false
  }
  const isAvail = (mat) => {
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat.length; j++) {
        if (mat[i][j] === null) return true
      }
    }
    return false
  }
  const getBoard = (mat) => {
    if (checkState(mat)) {
      decision = winPlayer === 'X' ? "Player 'X' wins" : "Player 'O' wins"
      setflag(true)
      const audio = new Audio('../resources/pop3.mp3')
      audio.play()
    }
  }
  const pvpMoveSet = (i, j, squares) => {
    const temp = squares.slice()
    if (count % 2 == 0) {
      temp[i][j] = player
    } else {
      temp[i][j] = opponent
    }
    setSquares(temp)
    setCount(count + 1)
  }
  const getRandomPosition = () => {
    let i = -1,
      j = -1
    let t = 500
    do {
      i = Math.floor(Math.random() * 3)
      j = Math.floor(Math.random() * 3)
    } while (t--)
    console.log(i, j)
    if (squares[i][j]) {
      for (let x = 0; x < squares.length; x++) {
        for (let y = 0; y < squares.length; y++) {
          if (squares[x][y] === null) {
            return [x, y]
          }
        }
      }
    }
    return [i, j]
  }
  //------------------driver code starts here-----
  const handleSquare = (i, j) => {
    console.log(player)
    const audio = new Audio('../resources/pop.mp3')
    audio.play()
    const currMat = squares.slice()
    let occur = false
    if (currMat[i][j] === null) {
      currMat[i][j] = player
      occur = true
    }
    else return;
    setSquares(currMat)
    if (!isAvail(squares)) {
      decision = 'Match draw'
      setflag(true)
      const audio = new Audio('../resources/pop3.mp3')
      audio.play()
    }
    if (modeDecision === 'pvp' && occur) {
      // if(squares[i][j]===null)
      // pvpMoveSet(i, j, squares)
      ;[player, opponent] = [opponent, player]
      getBoard(squares)
    } else {
      setTimeout(() => {
        if (difficulty === 'easy') {
          if (randomMove >= 2 || Math.random() < 0.5) {
            findBestMove(squares)
          } else {
            setRandomMove(randomMove + 1)
            console.log('checking')
            let [i, j] = getRandomPosition()
            console.log(i, j)
            let temp = squares.slice()
            temp[i][j] = opponent
            setSquares(temp)
          }
        }
        if (difficulty === 'medium') {
          if (randomMove >= 1 || Math.random() < 0.5) {
            findBestMove(squares)
          } else {
            setRandomMove(randomMove + 1)
            console.log('checking')
            let [i, j] = getRandomPosition()
            console.log(i, j)
            let temp = squares.slice()
            temp[i][j] = opponent
            setSquares(temp)
          }
        }
        if (difficulty === 'hard') {
          findBestMove(squares)
        }
        getBoard(squares)
      }, 200)
    }
  }
  //---------driver code ends here------------
  const findBestMove = (mat) => {
    let best = -Infinity
    let row = -1
    let col = -1
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat.length; j++) {
        if (mat[i][j] === null) {
          mat[i][j] = opponent //machine trying to put value to test if that leads to the optimal move
          let currval = minimax(mat, false)
          mat[i][j] = null
          if (currval > best) {
            row = i
            col = j
            best = currval
          }
        }
      }
    }
    let tempMat = squares.slice()
    if (row !== -1 && col !== -1) tempMat[row][col] = opponent
    setSquares(tempMat)
  }
  const minimax = (mat, maxMove) => {
    let cost = checkState(squares) // check if it is in any winning state
    if (cost) {
      //checking who's winning
      if (winPlayer === 'O') {
        if (player === 'O') return -1
        return 1
      } else {
        if (player === 'X') return -1
        return 1
      }
    }
    if (!isAvail(squares)) return 0
    if (maxMove) {
      // if it comes in this part then player has put his move so now its machine's turn.. machine wants to maximize his move
      let best = -Infinity
      for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat.length; j++) {
          if (mat[i][j] === null) {
            mat[i][j] = opponent
            best = Math.max(best, minimax(mat, !maxMove))
            mat[i][j] = null
          }
        }
      }
      return best
    } else {
      // if it comes in this part then we know that machine has put its move.. now trying to minimize the player's move
      let best = Infinity
      for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat.length; j++) {
          if (mat[i][j] === null) {
            mat[i][j] = player
            best = Math.min(best, minimax(mat, !maxMove))
            mat[i][j] = null
          }
        }
      }
      return best
    }
  }
  const resetBoard = (mode) => {
    const audio = new Audio('../resources/pop2.mp3')
    audio.play()
    let temp = Array.from({ length: 3 }, () => Array(3).fill(null))
    setSquares(temp)
    setflag(false)
    setRandomMove(0)
    if (mode === 'all') {
      setCount(0)
      setModeDecision('')
      setChooseModeFlag(false)
      setOpenBoard(false)
      setshowChoose(false)
      setflag2(false)
      setDifficulty('')
    }
    // for(let i=0;i<mat.length;i++){
    //   for(let j=0;j<mat.length;j++){

    //   }
    // }
  }
  const choosePlayer = (val) => {
    const audio = new Audio('../resources/pop2.mp3')
    audio.play()
    
    if (val === 'X') {
      player = 'X'
      opponent = 'O'
    } else {
      player = 'O'
      opponent = 'X'
    }
    setshowChoose(true)
    setTimeout(() => {
      setflag2(true)
      if (modeDecision === 'pvp') setOpenBoard(true)
    }, 300)
  }
  return (
    <>
      {
        <div className={`board ${openBoard ? 'openBoard' : 'closedBoard'}`}>
          {flag && <div className='cover'></div>}
          <div className='barH' style={{ left: '33%' }}></div>
          <div className='barH' style={{ left: '66%' }}></div>
          <div className='barV' style={{ top: '33%' }}></div>
          <div className='barV' style={{ top: '66%' }}></div>
          <Box
            value={squares[0][0]}
            onSquareClick={() => handleSquare(0, 0)}
          ></Box>
          <Box
            value={squares[0][1]}
            onSquareClick={() => handleSquare(0, 1)}
          ></Box>
          <Box
            value={squares[0][2]}
            onSquareClick={() => handleSquare(0, 2)}
          ></Box>
          <Box
            value={squares[1][0]}
            onSquareClick={() => handleSquare(1, 0)}
          ></Box>
          <Box
            value={squares[1][1]}
            onSquareClick={() => handleSquare(1, 1)}
          ></Box>
          <Box
            value={squares[1][2]}
            onSquareClick={() => handleSquare(1, 2)}
          ></Box>
          <Box
            value={squares[2][0]}
            onSquareClick={() => handleSquare(2, 0)}
          ></Box>
          <Box
            value={squares[2][1]}
            onSquareClick={() => handleSquare(2, 1)}
          ></Box>
          <Box
            value={squares[2][2]}
            onSquareClick={() => handleSquare(2, 2)}
          ></Box>
        </div>
      }
      {!flag && !flag2 && chooseModeFlag && (
        <>
          <div
            className={`choosePlayer playerX ${showChoose ? 'popIn' : ''}`}
            onClick={() => choosePlayer('X')}
          >
            <i className='fa-solid fa-xmark'></i>
          </div>
          <span className='or'>OR</span>
          <div
            className={`choosePlayer playerY ${showChoose ? 'popIn' : ''}`}
            onClick={() => choosePlayer('O')}
          >
            <i className='fa-regular fa-circle'></i>
          </div>
        </>
      )}
      {!flag && modeDecision === 'pvai' && showChoose && !openBoard && (
        <div className={`difficulty ${difficulty !== '' ? 'popIn' : ''}`}>
          <div className='header'>
            <span>Difficulty:</span>
          </div>
          <div className='diffBox'>
            <div
              className='diffMode easy'
              onClick={() => {
                const audio = new Audio('../resources/pop2.mp3')
                audio.play()
                setDifficulty('easy')
                setTimeout(() => {
                  setOpenBoard(true)
                }, 300)
              }}
            >
              <i class='fa-solid fa-baby'></i>
            </div>
            <div
              className='diffMode medium'
              onClick={() => {
                const audio = new Audio('../resources/pop2.mp3')
                audio.play()
                setDifficulty('medium')
                setTimeout(() => {
                  setOpenBoard(true)
                }, 300)
              }}
            >
              <i class='fa-solid fa-school'></i>
            </div>
            <div
              className='diffMode hard'
              onClick={() => {
                const audio = new Audio('../resources/pop2.mp3')
                audio.play()
                setDifficulty('hard')
                setTimeout(() => {
                  setOpenBoard(true)
                }, 300)
              }}
            >
              <i class='fa-solid fa-brain'></i>
            </div>
          </div>
        </div>
      )}
      {flag && <div className='output'>{decision}</div>}
      {flag && (
        <>
          <div
            className='resetBtn resetCurrent'
            onClick={() => resetBoard('current')}
          >
            <div className='resetBtnInner'>
              <i className='fa-solid fa-arrow-rotate-left'></i>
            </div>
          </div>
          <div className='resetBtn resetAll' onClick={() => resetBoard('all')}>
            <div className='resetBtnInner'>
              <i class='fa-solid fa-house'></i>
            </div>
          </div>
        </>
      )}
      {!chooseModeFlag && (
        <>
          <div
            className='chooseMode chooseModePlayer'
            onClick={() => {
              const audio = new Audio('../resources/pop2.mp3')
              audio.play()
              setModeDecision('pvp')
              setChooseModeFlag(true)
            }}
          >
            <i class='fa-regular fa-user'></i>
            <span>vs</span>
            <i class='fa-regular fa-user'></i>
          </div>
          <div
            className='chooseMode chooseModeAI'
            onClick={() => {
              const audio = new Audio('../resources/pop2.mp3')
              audio.play()
              setModeDecision('pvai')
              setChooseModeFlag(true)
            }}
          >
            <i class='fa-regular fa-user'></i>
            <span>vs</span>
            <i class='fa-solid fa-microchip'></i>
          </div>
        </>
      )}
    </>
  )
}

export default Board
