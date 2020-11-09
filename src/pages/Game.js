import React from 'react';
import './Game.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { fetchApi, scoreFunction } from '../actions';
import Header from './Header';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.decodeHTML = this.decodeHTML.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.state = {
      stop: false,
      counter: 0,
      timer: 30,
      randomNumber: 0,
    };
  }

  componentDidMount() {
    this.random();
    const { questionFetch } = this.props;
    const miliseconds = 1000;
    questionFetch();
    this.timerID = setInterval(() => this.timerFunction(), miliseconds);
  }

  timerFunction() {
    const { timer, stop } = this.state;
    if (timer > 0 && !stop) {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    } else {
      this.setState({ stop: true });
    }
  }

  decodeHTML(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  nextQuestion() {
    const { counter } = this.state;
    this.setState({
      stop: false,
      counter: counter + 1,
      timer: 30,
    });
    this.random();
  }

  random() {
    const four = 4;
    this.setState({
      randomNumber: Math.floor(Math.random() * (four - 0)) + 0,
    });
  }

  shuffle(array) {
    const { randomNumber } = this.state;
    [array[0], array[randomNumber]] = [array[randomNumber], array[0]];
    return array;
  }

  render() {
    const { counter, timer, stop } = this.state;
    const { results, scoreSum, isFetching } = this.props;
    const five = 5;
    if (counter === five) {
      return <Redirect to="/feedback" />;
    }
    if (isFetching) {
      return <div className="container-game loading">CARREGANDO...</div>;
    }
    return (
      <div>
        <Header />
        <div className="container-game">
          <div className="right">
            <div className="timer">
              <Icon fitted name="hourglass half" />
              { timer > 0 ? `TEMPO: ${timer}s` : 'TEMPO ESGOTADO' }
            </div>
            <br />
            <div data-testid="question-category">
              CATEGORIA[
              { this.decodeHTML(results[counter].category) }
              ]
            </div>
            <div className="question" data-testid="question-text">
              { this.decodeHTML(results[counter].question) }
            </div>
          </div>
          <div className="buttons">
            { this.shuffle([(
              <button
                key="correct"
                style={ { border: `${stop ? '3' : '0'}px solid rgb(6, 240, 15)` } }
                type="button"
                className="btn btn-secondary btn-lg mt-4 ml-2 mr-2"
                data-testid="correct-answer"
                onClick={
                  () => { scoreSum(timer, counter); this.setState({ stop: true }); }
                }
                disabled={ stop }
              >
                { this.decodeHTML(results[counter].correct_answer) }
              </button>),
            ...results[counter].incorrect_answers.map((answer, index) => (
              <button
                key={ `incorrect-${index}` }
                style={ { border: `${stop ? '3' : '0'}px solid rgb(255, 0, 0)` } }
                type="button"
                className="btn btn-secondary btn-lg mt-4 ml-2 mr-2"
                data-testid={ `wrong-answer-${index}` }
                onClick={ () => { this.setState({ stop: true }); } }
                disabled={ stop }
              >
                { this.decodeHTML(answer) }
              </button>))])}
            <div className="nextbutton">
              <button
                type="button"
                className="btn btn-warning btn-block mt-4"
                data-testid="btn-next"
                style={ stop ? { display: 'block' } : { display: 'none' } }
                onClick={ this.nextQuestion }
              >
                PRÓXIMA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  questionFetch: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(Object).isRequired,
  scoreSum: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isFetching: state.game.isFetching,
  results: state.game.results,
});

const mapDispatchToProps = (dispatch) => ({
  questionFetch: () => dispatch(fetchApi()),
  scoreSum: (timer, counter) => dispatch(scoreFunction(timer, counter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
