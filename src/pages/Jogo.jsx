import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { solicitacaoQuestoes } from '../actions';
import '../css/jogo.css';

class Jogo extends React.Component {
  constructor() {
    super();
    this.state = {
      contador: 0,
      classe: false,
      contagem: 30,
      disable: false,
    };
    this.handleClique = this.handleClique.bind(this);
    this.handleClass = this.handleClass.bind(this);
    this.setContagem = this.setContagem.bind(this);
  }

  componentDidMount() {
    const { dispatchPerguntas, token } = this.props;
    dispatchPerguntas(token);
    setInterval(this.setContagem, 1000);
  }

  setContagem() {
    const { contagem } = this.state;
    if (contagem > 0) {
      this.setState((anterior) => ({
        ...anterior,
        contagem: anterior.contagem - 1,
      }));
    } else {
      this.setState({
        contagem: 0,
        disable: true,
      });
    }
  }

  handleClass() {
    this.setState({
      classe: true,
    });
  }

  handleClique() {
    this.setState((prevState) => ({
      contador: prevState.contador + 1,
      classe: false,
    }));
  }

  render() {
    const { perguntas } = this.props;
    const { contador, classe, disable, contagem } = this.state;
    console.log('perguntas no render', perguntas);
    let correctAnswer = '';
    let options = '';
    if (perguntas.length > 0 ) {
      correctAnswer = perguntas[contador].correct_answer;
      options = [...perguntas[contador].incorrect_answers, correctAnswer].sort();
    }

    return (
      <div>
        <div>
          <Header />
        </div>
        <span>{contagem}</span> 
        { perguntas.length > 0 ?
          <div>
            <h2 data-testid="question-category">{ `${perguntas[contador].category}` }</h2>
            <p data-testid="question-text">{ perguntas[contador].question }</p>
            {options.map((option, index) => (
              <div key={ index }>
                <button
                  type="button"
                  data-testid={ option === correctAnswer ? "correct-answer" : `wrong-answer${index}` }
                  disabled={ disable }
                  onClick={ this.handleClass }
                  className={ option === correctAnswer ? `${classe ? 'correct' : ''}` : `${classe ? 'wrong' : ''}` }
                >
                  {option}
                </button>
              </div>
            ))}
            <button type="button" onClick={ this.handleClique }>Próxima Questão</button>
          </div>
          : <span>Loading...</span>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.reducerAPI.token,
  perguntas: state.reducerAPI.questions,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchPerguntas: (token) => dispatch(solicitacaoQuestoes(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jogo);
