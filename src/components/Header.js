import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import '../css/header.css';

class Header extends Component {
  getAvatar() {
    const { email } = this.props;
    const avatar = `https://www.gravatar.com/avatar/${md5(email).toString()}`;
    return avatar;
  }

  render() {
    const { name } = this.props;
    return (
      <div>
        <header className="header">
          <img
            data-testid="header-profile-picture"
            src={ this.getAvatar() }
            alt="Imagem gravatar"
          />
          <p className="name" data-testid="header-player-name">{name}</p>
          <p data-testid="header-score">0</p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.user.name,
  email: state.user.email,
});

Header.propTypes = {
  name: propTypes.string.isRequired,
  email: propTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(Header);
