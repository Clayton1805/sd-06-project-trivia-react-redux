import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { updateScore } from '../actions';
import Timer from '../components/Timer';
import '../css/Game.css';

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      questionNumber: 0,
      answered: false,
      timer: false,
    };

    this.renderAnswers = this.renderAnswers.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderNext = this.renderNext.bind(this);
    this.chooseAnswer = this.chooseAnswer.bind(this);
    this.handleScore = this.handleScore.bind(this);
    this.chooseNextQuestion = this.chooseNextQuestion.bind(this);
    this.stateTimer = this.stateTimer.bind(this);
  }

  handleScore({ target }) {
    const { difficulty, toUpdateScore, timer, score } = this.props;
    let difficultyMultiplier = 0;

    switch (difficulty) {
    case 'easy':
      difficultyMultiplier = 1;
    case 'hard':
      difficultyMultiplier = 3;
    default:
      difficultyMultiplier = 2;
    }
 
    if (target.className === 'correct-answer') {
      const addScore = 10 + (timer * difficultyMultiplier);
      toUpdateScore(addScore);
    }

    localStorage.setItem('score', score);
  }

  componentDidMount() {
    const maxTime = 30000;
    setTimeout(() => this.stateTimer(), maxTime);
  }

  stateTimer() {
    this.setState({ answered: true, timer: true });
  }

  chooseAnswer() {
    this.setState({ answered: true });
  }

  chooseNextQuestion() {
    this.setState((prevState) => ({
      questionNumber: prevState.questionNumber + 1,
      answered: false,
    }));
  }

  renderQuestions() {
    const { questions } = this.props;
    const { questionNumber } = this.state;
    return (
      <div>
        <h4 data-testid="question-category">{ questions[questionNumber].category }</h4>
        <h4 data-testid="question-text">{ questions[questionNumber].question }</h4>
      </div>
    );
  }

  renderAnswers() {
    const { questionNumber, answered, timer } = this.state;
    const { chooseAnswer } = this;
    const { questions } = this.props;
    const correctAnswerPosition = Math
      .floor(Math
        .random() * questions[questionNumber].incorrect_answers.length + 1);
    const answers = questions[questionNumber].incorrect_answers;

    if (!answered) {
      answers.splice(correctAnswerPosition, 0, questions[questionNumber].correct_answer);
    }

    return (
      <div>
        {
          answers.map((answer, index) => {
            if (answer === questions[questionNumber].correct_answer) {
              return (
                <button
                  className={ answered ? 'correct-answer' : null }
                  type="button"
                  onClick={ chooseAnswer }
                  data-testid="correct-answer"
                  key={ index }
                  disabled={ timer }
                >
                  { answer }
                </button>
              );
            }
            return (
              <button
                className={ answered ? 'wrong-answer' : null }
                type="button"
                onClick={ chooseAnswer }
                data-testid={ `wrong-answer-${index}` }
                key={ index }
                disabled={ timer }
              >
                { answer }
              </button>
            );
          })
        }
      </div>
    );
  }

  renderNext() {
    const { answered } = this.state;
    const { chooseNextQuestion } = this;
    if (answered) {
      return (
        <div>
          <button
            type="button"
            data-testid="btn-next"
            onClick={ chooseNextQuestion }
          >
            Próxima
          </button>
        </div>
      );
    }
  }

  render() {
    const { renderAnswers, renderQuestions, renderNext } = this;

    return (
      <div>
        <div>
          <Header />
          <Timer />
        </div>
        { renderQuestions() }
        { renderAnswers() }
        { renderNext() }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  questions: state.game.questions,
  difficulty: state.game.difficulty,
  timer: state.game.timer,
  score: state.game.timer,
});

const mapDispatchToProps = (dispatch) => ({
  toUpdateScore: (score) => dispatch(updateScore(score)),
});

Game.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  toUpdateScore: PropTypes.func.isRequired,
  difficulty: PropTypes.string.isRequired,
  timer: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
