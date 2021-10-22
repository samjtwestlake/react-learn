import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
    const style = {
        backgroundColor: props.fillColor,
        padding: '6px',
    }
    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    }
    const fps = {
        wp: './img/White_Pawn.png',
        wn: './img/White_Knight.png',
        wb: './img/White_Bishop.png',
        wr: './img/White_Rook.png',
        wq: './img/White_Queen.png',
        wk: './img/White_King.png',
        bp: './img/Black_Pawn.png',
        bn: './img/Black_Knight.png',
        bb: './img/Black_Bishop.png',
        br: './img/Black_Rook.png',
        bq: './img/Black_Queen.png',
        bk: './img/Black_King.png',
    }

    return (
        <div className="square" style={style} onClick={props.handler}>
            { props.content &&
                <img src={fps[props.content]} style={imgStyle}></img>
            }
        </div>
    )
    
}

function Board(props) {
    function initState() {
        let initState = [];
        for (let i = 0; i < 8; i++) {
            initState.push(new Array(8));
        }
        initState[0] = ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'];
        initState[1] = ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'];
        initState[6] = ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'];
        initState[7] = ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'];
        return initState;
    }

    const [grid, setGrid] = useState(initState());
    const [activePlayer, setActivePlayer] = useState('w');
    const [selected, setSelected] = useState(null);

    const moves = {
        'p': [[1, 0]],
        'b': [[1, 1], [-1, 1], [-1, -1], [1, -1]],
        'n': [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]],
        'r': [[1, 0], [0, 1], [-1, 0], [0, -1]],
        'q': [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
        'k': [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
    }

    const discreteTypes = ['p', 'n', 'k'];
    const continuousTypes = ['b', 'r', 'q'];

    const style = {
        display: "grid",
        width: "700px",
        height: "700px",
        gridTemplateColumns: "repeat(8, minmax(50px, 200px))",
        gridTemplateRows: "repeat(8, minmax(50px, 200px))",
        border: "4px black solid",
    }

    function isValidMove(i2, j2) {
        let [i1, j1] = selected;
        let piece = grid[i1][j1];
        let [player, type] = piece;
        let m = (player == 'b') ? 1 : -1;
        let vec = [(i2-i1)*m, j2-j1];
        let isDiscrete = discreteTypes.includes(type);

        let n = isDiscrete ? 2 : 8;
        for (let x = 1; x < n; x++) {
            for (let allowedVec of moves[type]) {
                if (vec[0] == allowedVec[0]*x && vec[1] == allowedVec[1]*x) {
                    return true;
                }
            }
        }
        return false;
    }

    function applyMove(i2, j2) {
        let [i1, j1] = selected;
        let piece = grid[i1][j1];
        let tmpGrid = grid.map((arr) => arr.slice());
        tmpGrid[i2][j2] = piece;
        tmpGrid[i1][j1] = null;
        setGrid(tmpGrid);
        setActivePlayer((activePlayer == 'w' ? 'b' : 'w'))
        setSelected(null)
    }

    function clickSquare(i, j) {
        let piece = grid[i][j];
        if (piece) {
            let [player, type] = piece;
            if (player == activePlayer) {
                setSelected([i, j]);
            }
        }
        if (selected && isValidMove(i, j)) {
            applyMove(i, j);
        }
    }

    let squares = [];
    let colors = ['white', 'grey'];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let color = colors[(j % 2 + i % 2) % 2];
            squares.push(<Square key={`r${i} c${j}`} fillColor={color} row={i} col={j} content={grid[i][j]} handler={() => clickSquare(i, j) }/>);
        }
    }
    return (
        <div style={style}>
            {squares}
        </div>
    )
}

ReactDOM.render(<Board/>, document.getElementById('root'));
