import React from 'react';
import trivia from '../images/trivia.png';
import Questions from '../components/Questions';

class Gamepage extends React.Component {
  render() {
    return (
      <div>
        <header>
          <img
            src={ trivia }
            alt="gravatar"
            data-testid="header-profile-picture"
            className="img-logo"
          />
          <p
            data-testid="header-player-name"
          >
            Nome da pessoa
          </p>
          <span
            data-testid="header-score"
          >
            Placar: 0
          </span>
        </header>
        <Questions />
      </div>
    );
  }
}

export default Gamepage;