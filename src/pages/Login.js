import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUserInfo } from '../actions';
import { reqToken } from '../services';
import '../css/Login.css';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      isDisable: true,
    };

    this.handleInput = this.handleInput.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateFields() {
    const { name, email } = this.state;
    const emailFormat = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/.test(email);

    if (emailFormat && name.length !== 0) {
      this.setState({ isDisable: false });
    } else this.setState({ isDisable: true });
  }

  handleInput({ target }) {
    this.setState({ [target.name]: target.value }, () => {
      this.validateFields();
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { history } = this.props;
    const { setName } = this.props;
    const { name, email } = this.state;
    setName(name, email);
    const token = await reqToken().then((data) => data.token);
    window.localStorage.setItem('token', JSON.stringify(token));
    history.push('/game');
  }

  render() {
    const { name, email, isDisable } = this.state;
    return (
      <div>
        <Link to="/settings">
          <button
            type="button"
            data-testid="btn-settings"
            className="buttonSettings"
          >
          Configurações
          </button>
        </Link>
        <br />
        <h1>SHOW DO PIPOCÃO</h1>
        <form onSubmit={ this.handleSubmit }>
          <input
            className="inputLogin"
            type="text"
            value={ name }
            name="name"
            placeholder="Nome"
            onChange={ this.handleInput }
            required
            data-testid="input-player-name"
          />
          <br />
          <input
            className="inputLogin"
            type="email"
            value={ email }
            name="email"
            placeholder="Email"
            onChange={ this.handleInput }
            required
            data-testid="input-gravatar-email"
          />
          <br />
          <button
            type="submit"
            disabled={ isDisable }
            data-testid="btn-play"
            className="buttonPlay"
          >
            Jogar
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.name,
});

const mapDispatchToProps = (dispatch) => ({
  setName: (playerName, playerEmail) => dispatch(setUserInfo(playerName, playerEmail)),
});

Login.propTypes = {
  setName: propTypes.func.isRequired,
  history: propTypes.shape({ push: propTypes.func }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
