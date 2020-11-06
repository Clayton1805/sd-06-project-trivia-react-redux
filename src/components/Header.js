import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    const { hash, name, score } = this.props;
    return (
      <div>
        <img
          data-testid="header-profile-picture"
          src={ `https://www.gravatar.com/avatar/${hash}` }
          alt="gravatar"
        />
        <h2 data-testid="header-player-name">
            Jogador:
          {name}
        </h2>

        <h2 data-testid="header-score">
            Pontos:
          {score}
        </h2>
      </div>
    );
  }
}

Header.propTypes = {
  hash: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  hash: state.playerInfoReducer.hash,
  name: state.playerInfoReducer.name,
  score: state.playerInfoReducer.score,
});

export default connect(mapStateToProps)(Header);