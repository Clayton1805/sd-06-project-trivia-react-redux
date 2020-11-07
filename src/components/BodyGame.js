import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchQuestions, sendScore, sendAssertions } from '../actions';
import '../App.css';
import Timer from './Timer';

class BodyGame extends Component {
  constructor() {
    super();

    this.disableAnswerButtons = this.disableAnswerButtons.bind(this);
    this.handleCounter = this.handleCounter.bind(this);
    this.handleScoreToLocalStorage = this.handleScoreToLocalStorage.bind(this);
    this.handleQuestionIndex = this.handleQuestionIndex.bind(this);
    this.handleAssertions = this.handleAssertions.bind(this);

    this.state = {
      isDisabled: false,
      score: 0,
      counter: 30,
      questionIndex: 0,
      redirect: false,
      assertions: 0,
    };
  }

  async componentDidMount() {
    const { email, name } = this.props;
    const { score } = this.state;
    const assertions = 1;
    const localStoragePlayerInfo = {
      player: {
        name,
        assertions,
        score,
        gravatarEmail: email,
      },
    };
    localStorage.setItem('state', JSON.stringify(localStoragePlayerInfo));
    const { questionsFunction, getToken } = this.props;

    if (getToken !== '') {
      await questionsFunction();
    }
  }

  async componentDidUpdate(prevProps) {
    const { getToken, questionsFunction } = this.props;

    if (getToken !== prevProps.getToken && getToken !== '') {
      await questionsFunction();
    }
  }

  handleAnswerBorderColor() {
    const rightAnswer = document.querySelector('#right-answer');
    rightAnswer.className = 'right-question';
    const wrongAnswers = document.querySelectorAll('#wrong-answer');
    wrongAnswers.forEach((wrongAnswer) => {
      wrongAnswer.className = 'wrong-question';
    });
    const nextButton = document.querySelector('#next-button');
    nextButton.style = 'display: block';
  }

  disableAnswerButtons() {
    this.setState({
      isDisabled: true,
    });
  }

  handleCounter() {
    const { counter } = this.state;
    this.setState(() => ({
      counter: counter - 1,
    }));
  }

  handleScore(question, counter) {
    const { score } = this.state;
    const mininumScore = 10;
    const easy = 1;
    const medium = 2;
    const hard = 3;
    switch (question.difficulty) {
    case 'easy':
      this.setState({
        score: score + mininumScore + (counter * easy),
      }, () => {
        this.handleScoreToLocalStorage();
      });
      break;
    case 'medium':
      this.setState({
        score: score + mininumScore + (counter * medium),
      }, () => {
        this.handleScoreToLocalStorage();
      });
      break;
    case 'hard':
      this.setState({
        score: score + mininumScore + (counter * hard),
      }, () => {
        this.handleScoreToLocalStorage();
      });
      break;
    default:
      return score;
    }
  }

  handleScoreToLocalStorage() {
    const { email, name } = this.props;
    const { score } = this.state;
    const assertions = 1;
    const localStoragePlayerInfo = {
      player: {
        name,
        assertions,
        score,
        gravatarEmail: email,
      },
    };
    localStorage.setItem('state', JSON.stringify(localStoragePlayerInfo));
  }

  handleAssertions() {
    const { assertions } = this.state;
    this.setState({ assertions: assertions + 1 });
  }

  handleQuestionIndex() {
    const { questionIndex } = this.state;
    const lastQuestion = 4;
    if (questionIndex === lastQuestion) {
      this.setState({ redirect: true });
    }
    this.setState({
      questionIndex: questionIndex + 1,
      counter: 30,
    });
  }

  handleClickScore() {
    const { dispatchScore } = this.props;
    const { score } = this.state;
    dispatchScore(score);
  }

  handleClickAssertions() {
    const { dispatchAssertions } = this.props;
    const { assertions } = this.state;
    dispatchAssertions(assertions);
  }

  render() {
    const { questions } = this.props;
    const { isDisabled, counter, questionIndex, redirect } = this.state;
    return (
      <div className="container">
        {redirect ? <Redirect to="/feedback" /> : null}
        {questions.map((question, index) => (
          <div key={ index }>
            <div className="box-question">
              <div className="field-category">
                <h3 data-testid="question-category">{question.category}</h3>
              </div>
              <div className="field-question">
                <p data-testid="question-text">{question.question}</p>
              </div>
            </div>
            <div className="box-alternatives">
              <div>
                <button
                  type="button"
                  id="next-button"
                  data-testid="btn-next"
                  onClick={ () => {
                    this.handleQuestionIndex();
                    this.handleClickScore();
                  } }
                  style={ { display: 'none' } }
                >
                  Próxima
                </button>
                <button
                  id="right-answer"
                  type="button"
                  data-testid="correct-answer"
                  name="right-answer"
                  onClick={ () => {
                    this.handleScore(question, counter);
                    this.handleAnswerBorderColor();
                    this.handleAssertions();
                    this.handleClickAssertions();
                  } }
                  disabled={ isDisabled }
                >
                  {question.correct_answer}
                </button>
                {question.incorrect_answers.map((item, position) => (
                  <button
                    id="wrong-answer"
                    type="button"
                    key={ position }
                    data-testid={ `wrong-answer-${position}` }
                    name="wrong-answer"
                    onClick={ this.handleAnswerBorderColor }
                    disabled={ isDisabled }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )).filter((_, index) => index === questionIndex)}
        <Timer
          counter={ counter }
          handleCounter={ this.handleCounter }
          disableAnswerButtons={ this.disableAnswerButtons }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getToken: state.apiReducer.token,
  questions: state.apiReducer.questions,
  name: state.userReducer.name,
  email: state.userReducer.email,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchScore: (score) => dispatch(sendScore(score)),
  dispatchAssertions: (assertions) => dispatch(sendAssertions(assertions)),
  questionsFunction: () => dispatch(fetchQuestions()),
});

BodyGame.propTypes = {
  questionsFunction: PropTypes.func,
  getToken: PropTypes.string,
  questions: PropTypes.array,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(BodyGame);