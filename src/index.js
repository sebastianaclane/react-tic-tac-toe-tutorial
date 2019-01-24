import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends Component {
    // We Delete the constructor from Square because Square no longer keeps track of the game’s state since that is what Board does: 
    // constructor(props) {
    //   // In JavaScript classes, you need to always call super when defining the constructor of a subclass. All React component classes that have a constructor should start it with a super(props) call.
    //   super(props);
    //   // To “remember” things, components use state.
    //   this.state = {
    //     value: null
    //   }
    // }

    render() {
      return (
        // Notice how with onClick={() => alert('click')}, we’re passing a function as the onClick prop. It only fires after a click. Forgetting () => and writing onClick={alert('click')} is a common mistake, and would fire the alert every time the component re-renders.

        // By calling this.setState from an onClick handler in the Square’s render method, we tell React to re-render that Square whenever its <button> is clicked. After the update, the Square’s this.state.value will be 'X', so we’ll see the X on the game board. If you click on any Square, an X should show up.
        // When you call setState in a component, React automatically updates the child components inside of it too.
        <button 
              className="square" 
              onClick={() => this.props.onClick()}
              // onClick={() => this.setState({value: 'X'})}
        >
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends Component {
  // the best approach is to store the game’s state in the parent Board component instead of in each Square. The Board component can tell each Square what to display by passing a prop

    constructor(props) {
      super(props);

      this.state = {
        squares: Array(9).fill(null)
      }
    }

    renderSquare(i) {
      return <Square
                    value={this.state.squares[i]}
                    onClick={() => this.handleClick(i)}
              />
    }
  
    render() {
      const status = 'Next player: X';
  
      return (
        <div>
          <div className="status">{status}</div>
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
  
  class Game extends Component {
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
  