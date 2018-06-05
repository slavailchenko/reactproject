import React, { Component } from 'react';
import { Link, hashHistory, BrowserRouter } from 'react-router-dom';
import { Router, Route, IndexRoute } from 'react-router';
import {connect, Provider} from 'react-redux';

import {reduxForm, Field, formValueSelector} from 'redux-form';
import { reducer as formReducer } from 'redux-form';
import {combineReducers, createStore} from 'redux';

import './App.css';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";


function createQuestion (props) {
    return {
        type: 'CREATE_QUESTION',
        payload: props
    }
}


function deleteQuestion (props) {
    return {
        type: 'DELETE_QUESTION',
        payload: props
    }
}


function editQuestion (props) {
    return {
        type: 'EDIT_QUESTION',
        payload: props
    }
}


function  QuestionReducer (state = [], action) {
    switch (action.type) {
        case 'CREATE_QUESTION':
            return [...state, action.payload];
        case 'DELETE_QUESTION':
            return state.filter((question) => {
                return question.questionTitle !== action.payload
            });
        case 'EDIT_QUESTION':
            const newState = [...state];
            newState[action.payload.questionId] = {
                questionTitle: action.payload.questionTitle,
                questionAnswer: action.payload.questionAnswer,
                questionType: action.payload.questionType
            }
            return newState;
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    questions: QuestionReducer,
    form: formReducer
});

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {

    }
}

const persistedState = loadState();

const store = createStore(
    rootReducer,
    persistedState
);

store.subscribe(() => {
    saveState({
        questions: store.getState().questions
    });
})


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ''
        }
    }

    createQuestionHandler(props) {
        function sendQuestion() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.1) {
                        return reject();
                    }
                    return resolve();
                }, Math.random() * 1000);
            })
        }

        sendQuestion()
            .then(() => {
                this.props.reset();
                this.setState({error: 'false'});
                this.props.createQuestion(props);
            })
            .catch(() => {
                this.props.reset();
                this.setState({error: 'true'});
            })
    }

    renderQuestions(question, index) {
        return (
            <QuestionItem question={question} key={index} index={index}/>
        )
    }

    render() {
        const {handleSubmit, questionType, questions} = this.props;
        const {error} = this.state;
        return (
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <h2 className="display-4 text-xs-center">EZ-Quiz Creator 2000</h2>

                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group">
                            <label><Field name="questionType" component="input" type="radio" value="boolean"/>True or
                                False</label>
                            <label><Field name="questionType" component="input" type="radio" value="text"/>Text
                                Answer</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="questionTitle">Question title:</label>
                            <Field name="questionTitle" className="form-control" component="input" type="text"/>
                        </div>
                        {questionType == "text" && <div className="form-group">
                            <label htmlFor="questionAnswer">Question answer:</label>
                            <Field name="questionAnswer" className="form-control" component="input" type="text"/>
                        </div>}
                        {questionType == "boolean" && <div className="form-group">
                            <label><Field name="questionAnswer" component="input" type="radio"
                                          value="true"/>True</label>
                            <label><Field name="questionAnswer" component="input" type="radio"
                                          value="false"/>False</label>
                        </div>}
                        <button type="submit" className="btn btn-primary">Add Question</button>
                    </form>
                    {error == 'true' &&
                    <div className="alert alert-danger" role="alert">
                        Question save failed!
                    </div>
                    }
                    {error == 'false' &&
                    <div className="alert alert-success" role="alert">
                        Question saved!
                    </div>
                    }
                    <h4>Questions:</h4>
                    <div className="list-group">
                        {questions.map(this.renderQuestions)}
                    </div>
                    <Link to={"question/0"} className="btn btn-primary pull-xs-right">Student Mode</Link>
                </div>
            </div>
        )
    }
}

const selector = formValueSelector('questionForm');

function mapStateToProps(state) {
    return {
        questions: state.questions,
        questionType: selector(state, 'questionType')
    }
}

Home = reduxForm({
    form: 'questionForm'
})(Home)

Home = connect(mapStateToProps, {createQuestion})(Home);

class QuestionItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editView: false,
            questionTitle: '',
            questionAnswer: '',
            questionType: this.props.question.type,
            questionId: this.props.index
        }
    }

    handleChange(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    submitEditHandler(e) {
        e.preventDefault();
        this.props.editQuestion({
            questionTitle: this.state.questionTitle,
            questionAnswer: this.state.questionAnswer,
            questionType: this.props.question.type,
            questionId: this.props.index
        })
        this.setState({editView: false});
    }

    toggleEdit() {
        this.state.editView ? this.setState({editView: false}) : this.setState({editView: true});
    }

    render() {
        const {question, deleteQuestion} = this.props;
        return (
            <li className="list-group-item">
                <h5 className="list-group-item-heading">{question.questionTitle}</h5>
                <p className="list-group-item-text">Answer: {question.questionAnswer}</p>
                <button
                    onClick={this.toggleEdit.bind(this)}
                    className="btn btn-default">
                    Edit
                </button>
                <button
                    onClick={deleteQuestion.bind(this, question.questionTitle)}
                    className="btn btn-danger">
                    Delete
                </button>
                {this.state.editView &&
                <form onSubmit={this.submitEditHandler.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="questionTitle">Question:</label>
                        <input
                            onChange={this.handleChange.bind(this, 'questionTitle')}
                            name="questionTitle"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="questionAnswer">Answer:</label>
                        <input
                            onChange={this.handleChange.bind(this, 'questionAnswer')}
                            name="questionAnswer"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit edits</button>
                </form>}
            </li>
        )
    }
}

QuestionItem = connect(null, {deleteQuestion, editQuestion})(QuestionItem);


class Question extends Component {
    constructor(props) {
        super(props)

        this.state = {
            correct: 0,
            incorrect: 0,
            checked: false
        }
    }

    static contextTypes = {
        router: React.PropTypes.object
    };

      quizHandler(props) {
        if (this.props.params.id == this.props.questions.length - 1) {
            this.checkAnswers(props);
            this.props.reset();
        } else {
            this.context.router.push(`/question/${Number(this.props.params.id) + 1}`);

        }
    }

    checkAnswers(answers) {
        let correct = 0,
            incorrect = 0;

        this.props.questions.forEach((question, index) => {
            if (question.questionAnswer == answers[index]) {
                correct++;
            } else {
                incorrect++;
            }
        })

        this.setState({
            correct: correct,
            incorrect: incorrect,
            checked: true
        })
    }

    render() {
        const {handleSubmit, questions} = this.props;
        const {id} = this.props.params;

        if (!questions[id]) {
            return (
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <h2 className="display-4 text-xs-center">
                            No question found
                        </h2>
                    </div>
                </div>
            )
        }

        return (
            <div className="row">
                <div className="col-md-4 offset-md-4">
                    <h2 className="display-4 text-xs-center">
                        {questions[id].questionTitle}
                    </h2>
                    <form onSubmit={handleSubmit(this.quizHandler.bind(this))}>
                        <div className="form-group">
                            <label htmlFor={`question${id}`}>Your Answer:</label>
                            <Field name={`${id}`} component="input" className="form-control" type="text"/>
                            <Link
                                disabled={id == '0'}
                                to={`/question/${Number(id) - 1}`}
                                className={id == '0' ? "btn btn-danger pull-xs-left disabled" : "btn btn-danger pull-xs-left"}
                            >
                                Back
                            </Link>
                            <button
                                disabled={this.state.checked}
                                type="submit"
                                className="btn btn-primary pull-xs-right"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                    {this.state.checked &&
                    <div className="row text-xs-center">
                            <h4>{this.state.correct} correct</h4>
                            <h4>{this.state.incorrect} incorrect</h4>
                        <Link to="/" className="btn btn-danger">Back to creator mode</Link>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        questions: state.questions
    }
}

Question = reduxForm({
    form: 'answerForm',
    destroyOnUnmount: false
})(Question)

Question = connect(mapStateToProps)(Question);

class App1 extends Component {
  render() {
    return (
        <div>
          {this.props.children}
        </div>
    );
  }
}


class App extends Component {
  render() {
    return (
        <Provider store={store}>
        <BrowserRouter> 
    <Route path="/" component={App1} >
        <IndexRoute path="/home" component={Home} />
        <Route path="/question/:id" component={Question} />
    </Route>
    
     </BrowserRouter>
     </Provider>
  )
  }
}

export default App;






