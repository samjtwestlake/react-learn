import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
      return (
        <button 
            className="square"
            onClick={() => {
                this.props.handler(this.props.index);
            }}
        >
          {this.props.value}
        </button>
      );
    }
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'Next player: X',
            player: 'X',
            squares: Array(9).fill(null),
        }
        this.handler = this.handler.bind(this);
    }
    
    handler(i) {
        let nextPlayer;
        if (this.state.player === 'X') {
            nextPlayer = 'O';
        } else {
            nextPlayer = 'X';
        }
        let newSquares = this.state.squares.slice()
        newSquares[i] = this.state.player

        let status
        if(this.isGameOver(newSquares)) {
            status = `Player ${this.state.player} wins!`
        } else {
            status = `Next player: ${ nextPlayer }`
        }
        this.setState({ 
            status: status,
            player: nextPlayer,
            squares: newSquares,
        });
    }

    isGameOver(squares) {
        function getVertInds(i) {
            let inds = [];
            for (let x=0; x<3; x++) {
                inds.push((i + x*3) % 9);
            }
            return inds;
        }

        function getHorizInds(i) {
            let base = Math.floor(i / 3) * 3;
            let inds = []
            for (let x=0; x<3; x++) {
                inds.push(base + ((i + x) % 3));
            }
            return inds;
        }

        for (let i=0; i<9; i++) {
            let player = squares[i];
            if (player === null)
                continue;
            let vertInds = getVertInds(i);
            let horizInds = getHorizInds(i);
            let inds = [vertInds, horizInds];
            for (let arr of inds) {
                let connect = arr.map(i => squares[i]);
                if (connect.every(val => val === player))
                    return true;
            }
        }

        let diagInds = [[0, 4, 8], [2, 4, 6]];
        for (let arr of diagInds) {
            let player = squares[arr[0]];
            if (player === null) {
                continue;
            }
            let connect = arr.map(i => squares[i]);
            if (connect.every(val => val === player))
                return true;
        }
        return false;
    }

    renderSquare(i) {
        return <Square 
            value={this.state.squares[i]}
            handler={this.handler}
            index={i}
        />;
    }

    render() {
        return (
        <div>
            <div className="status">{this.state.status}</div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
        <div className="game">
            <div className="game-board">
            <Board />
            </div>
            <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
            </div>
        </div>
        );
}
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);  