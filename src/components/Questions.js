import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Questions extends React.Component {
  constructor() {
    super();

    this.state = {
      disable: false,
      tempo: 30,
      currentQuestion: 0,
    };

    this.nextQuestion = this.nextQuestion.bind(this);
  }

  nextQuestion() {
    this.setState((prev) => (
      {
        currentQuestion: prev.currentQuestion + 1,
        disable: false,
      }
    ));
    const buttonsWrong = document.querySelectorAll('[value=WrongAnswer]');
    const buttonsCorrect = document.querySelectorAll('[value=CorrectAnswer]');
    buttonsCorrect.forEach((button) => {
      button.style.border = '';
    });
    buttonsWrong.forEach((button) => {
      button.style.border = '';
    });
  }

  scored() {
    const state = JSON.parse(localStorage.getItem('state'));
    const { tempo, currentQuestion } = this.state;
    const { question } = this.props;
    const dez = 10;
    const tres = 3;
    let dif;

    switch (question[currentQuestion].difficulty) {
    case 'easy':
      dif = 1;
      break;
    case 'medium':
      dif = 2;
      break;
    case 'hard':
      dif = tres;
      break;
    default:
      break;
    }

    let soma = state.player.score;
    soma = soma + dez + (dif * tempo);
    localStorage.setItem(
      'state',
      JSON.stringify({ player: { ...state.player, score: soma } }),
    );
  }

  choosed(e) {
    if (e.target.value === 'CorrectAnswer') {
      this.scored();
    }
    this.setState({ disable: true });
    const buttonsWrong = document.querySelectorAll('[value=WrongAnswer]');
    const buttonsCorrect = document.querySelectorAll('[value=CorrectAnswer]');
    buttonsCorrect.forEach((button) => {
      button.style.border = '3px solid rgb(6, 240, 15)';
    });
    buttonsWrong.forEach((button) => {
      button.style.border = '3px solid rgb(255, 0, 0)';
    });
  }

  render() {
    const { currentQuestion, disable } = this.state;
    const { question } = this.props;
    console.log(question[currentQuestion].difficulty);
    if (currentQuestion === question.length) {
      return <Redirect to="/feedback" />;
    }
    return (
      <div>
        <h3 data-testid="question-category">
          Categoria:
          { question[currentQuestion].category }
        </h3>

        <p data-testid="question-text">
          Pergunta:
          { question[currentQuestion].question }
        </p>

        <p>Alternativas:  </p>
        {question[currentQuestion].respostas.map((resposta, index) => (
          <button
            key={ index }
            type="button"
            value={ resposta.value }
            data-testid={ resposta.dataTestid }
            disabled={ disable }
            onClick={ (event) => this.choosed(event) }
          >
            { resposta.resposta }
          </button>
        )) }
        {
          (disable
            && (
              <button
                data-testid="btn-next"
                onClick={ this.nextQuestion }
                type="button"
              >
                Próxima
              </button>))
        }
      </div>
    );
  }
}

Questions.propTypes = {
  question: PropTypes.objectOf(Object).isRequired,
};

export default Questions;
