// third
import React from 'react'
import ReactDOM from 'react-dom/client'

// local
import Board from './board.js'

export default class Game extends React.Component {
    // class constructor
    constructor(props){
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    // callback function called when a click is performed on a square
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1)
        const squares = history[history.length-1].squares.slice()

        // ignore click when game over or square already filled
        if (gameOver(squares) || squares[i]){
            return;
        }

        // edit the square content
        squares[i] = (this.state.xIsNext ? 'X' : 'O')
        
        // change state
        history.push({squares})
        this.setState({
            history: history,
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length-1
        })
    }

    // callback function called to perform history movement
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
        })
    }

    // render moves section
    renderMoves(){
        const history = this.state.history
        const moves = history.map((step, move) => {
            const desc = move != 0 ? `Go to move ${move}` : 'Go to game start'
            return <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        })

        return moves
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = gameOver(current.squares)

        // define game status
        let status
        if (winner){
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{ status }</div>
                <div>History size: {history.length}</div>
                <ol>{this.renderMoves()}</ol>
            </div>
        </div>
        )
    }
}

function gameOver(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
}