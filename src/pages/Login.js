import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginAction } from '../actions';
import trivia from '../images/trivia.png';
import triviaAPI from '../services/triviaAPI';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      username: '',
      disabled: true,
    };

    this.checkInputsValidity = this.checkInputsValidity.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  checkInputsValidity({ target }) {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => {
      const { email, username } = this.state;
      if (email.length > 0 && username.length > 0) {
        return this.setState({ disabled: false });
      }
      return this.setState({ disabled: true });
    });
  }

  async handleClick() {
    const { email, username } = this.state;
    const { login } = this.props;
    const token = await triviaAPI();
    localStorage.setItem('token', token);
    login(email, username);
  }

  render() {
    const { email, username, disabled } = this.state;
    return (
      <div className="login-container">
        <img
          src={ trivia }
          alt="Logo"
          className="img-logo"
        />
        <br />
        <div>
          <Link
            to="/settings"
          >
            <button
              type="button"
              data-testid="btn-settings"
            >
              Configurações
            </button>
          </Link>
          <br />
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Email do Gravatar"
            data-testid="input-gravatar-email"
            value={ email }
            onChange={ this.checkInputsValidity }
            required
          />
          <br />
          <input
            name="username"
            id="username"
            type="username"
            data-testid="input-player-name"
            placeholder="Nome do Jogador"
            value={ username }
            onChange={ this.checkInputsValidity }
            required
          />
          <br />
          <Link
            to="/gamepage"
          >
            <button
              id="button"
              type="button"
              disabled={ disabled }
              data-testid="btn-play"
              onClick={ () => this.handleClick() }
            >
              JOGAR!
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (email, username) => dispatch(loginAction(email, username)),
});

export default connect(null, mapDispatchToProps)(Login);

Login.propTypes = {
  login: PropTypes.func.isRequired,
};
