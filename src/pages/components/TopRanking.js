import React from 'react';
import PropTypes from 'prop-types';

class TopRanking extends React.Component {
  render() {
    const { name, picture, score, index } = this.props;
    return (
      <li>
        <img
          src={ picture }
          alt={ `${name} profile` }
        />
        <p>
          <span data-testid={ `player-name-${index}` }>
            { name }
          </span>
          {' '}
          <span data-testid={ `player-score-${index}` }>
            { score }
          </span>
        </p>
      </li>
    );
  }
}

TopRanking.propTypes = {
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default TopRanking;
