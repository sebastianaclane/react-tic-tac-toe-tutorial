import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    // in a function component we don’t need to worry about this.
    // so instead of this.props.onClick or this.props.value use props.onClick and props.value
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends Component {
    // deleting the constructor in board as Game will hold state now
    // constructor(props) {
    //   super(props);

    //   this.state = {
    //     squares: Array(9).fill(null),
    //     xIsNext: true
    //   }
    // }
    renderSquare(i) {
      return <Square
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
              />
    }
  
    render() {
      return (
        <div>
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
  
  // Placing the history state into the Game component lets us remove the squares state from its child Board component. Just like we “lifted state up” from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board’s data, and lets it instruct the Board to render previous turns from the history.
  class Game extends Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0, // reflects the move displayed to the user now
        xIsNext: true
      }
    }

    handleClick(i) {
      // we use .slice() below to modify a copied version of the array instead of the existing array so we can track the game's history

      // We will also replace reading this.state.history below with this.state.history.slice(0, this.state.stepNumber + 1). This ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
      // const history = this.state.history;
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        // .concat() is like .push() for arrays but it creates a copied array and pushes the new elements to the copied array so it is better in React
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length, // this ensures we don't get stuck showing the same move after a new one has been made
        xIsNext: !this.state.xIsNext
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        // We also set xIsNext to true if the number that we’re changing stepNumber to is even:
        xIsNext: (step % 2) === 0
      })
    }

    render() {
      const history = this.state.history;
      // we will modify the Game component’s render method from always rendering the last move to rendering the currently selected move according to stepNumber:
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          // When you don't use key or ref React returns this as an error in the console:
          /*
            Warning: Each child in an array or iterator should have a unique "key" prop.%s%s See https://fb.me/react-warning-keys for more information.%s 

            Check the render method of `Game`.  
                in li (created by Game)
                in Game
          */
         // if you add the key as <li key={move}> and React’s warning about keys should disappear:
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
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
            <div>{status}</div>
            <ol>{moves}</ol>
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

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    } 
    return null;
  }