import React, { useEffect, useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import logo from './logo.svg';
import x from './x.svg';
import o from './o.svg';
import winnerX from './winner-x.svg';
import winnerO from './winner-o.svg';

/*
====================
Usage:
const game = new TicTacToeGame();
game.play(0, 0);
game.play(1, 0);

const judge = new TicTacTowJudge(game);
const hasWinner = judge.checkWinner();
====================
*/


class TicTacTowJudge {
    checkRows(board) {
        const res = board.map((row) => row.every((cell) => cell !== ' ' && cell === row[0]));
        return res.includes(true);
    }

    checkColumns(board) {
        const columns = [
            [board[0][0], board[1][0], board[2][0]],
            [ board[0][1], board[1][1], board[2][1]],
            [ board[0][2], board[1][2], board[2][2]],
        ];
        const res = columns.map((column) => column.every((cell) => cell !== ' ' && cell === column[0]));
        return res.includes(true);
    }

    checkDiagonals(board) {
        const diagonals = [
            [board[0][0], board[1][1], board[2][2]],
            [ board[0][2], board[1][1], board[2][0]],
        ];
        const res = diagonals.map((diagonal) => diagonal.every((cell) => cell !== ' ' && cell === diagonal[0]));
        return res.includes(true);
    }

    checkWinner(board) {
        return this.checkRows(board)
            || this.checkColumns(board)
            || this.checkDiagonals(board);
    }
}

class TicTacToeGame {
    constructor(board) {
        this.symbols = ['X', 'O'];
        this.player = 0;
        this.win = null;
        this.board = board || [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' '],
        ];
        this.judge = new TicTacTowJudge();
        this.started = Date.now();
    }

    updatePlayer() {
        this.player = this.player === 0 ? 1 : 0;
    }

    setSymbols(first, second) {
        this.symbols = [first, second];
    }

    play(x, y) {
        if (this.board[x][y] !== ' ' || this.win !== null) {
            return;
        }

        const symbol = this.symbols[this.player];
        this.board[x][y] = symbol;
        const hasWinner = this.judge.checkWinner(this.board);
        if (hasWinner) {
            this.win = this.player;
        }
        this.updatePlayer();
    }

    winner() {
        return this.win !== null ? this.symbols[this.win] : null;
    }

    currentState() {
        return this.board;
    }
}

export default function TicTacToe() {
    const [game, setGame] = useState(new TicTacToeGame());
    const [board, setBoard] = useState({
        current: game.currentState(),
    });

    useEffect(() => {
        setBoard({ current: game.currentState() });
    }, [game])

    
    const play = (x, y) => {
        return () => {
            game.play(x, y);
            setBoard({ current: game.currentState() });
        }
    };
    
    const renderRow = (row, x) => {
        const styles = {
            display: 'flex',
            justifyContent: 'center',
        };
        return (
            <div key={x} data-x={x} style={styles}>
                <Square key={`${x}-${0}`} pos={`${x}-${0}`} text={row[0]} onClick={play(x, 0)} />
                <Square key={`${x}-${1}`} pos={`${x}-${1}`} text={row[1]} onClick={play(x, 1)} />
                <Square key={`${x}-${2}`} pos={`${x}-${2}`} text={row[2]} onClick={play(x, 2)} />
            </div>
        );
    };

    const renderWinner = (winner) => {
        if (winner === 'X') {
            return <img src={winnerX} alt="winner is X" />;
        } else if (winner === 'O') {
            return <img src={winnerO} alt="winner is O" />;
        } else {
            return '';
        }
    }
    
    const winner = game.winner();

    return (
        <div className="gameContainer">
            <h1 className="logo">
                <img src={logo} alt="logo" />
            </h1>
            <h3 className="winner-title">{renderWinner(winner)}</h3>
            <div>
                {board.current.map((row, index) => renderRow(row, index))}
            </div>
            <div className="buttonContainer">
                <button onClick={() => setGame(new TicTacToeGame())}>New Game</button>
                <button onClick={() => console.log(game)}>Debug</button>
            </div>
        </div>
    );
}

function Square({pos, text, onClick}) {
    return (
        <button 
            data-pos={pos}
            className="square"
            onClick={onClick}>
                {text === 'X' && <img src={x} alt={text} />}
                {text === 'O' && <img src={o} alt={text} />}
                {text === ' ' && ''}
            </button>
    );
}

let root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <TicTacToe />
    </StrictMode>
);