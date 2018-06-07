import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {reduxForm, Field} from 'redux-form';
import { Grid, Col, Button, ButtonGroup } from 'react-bootstrap';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Radio from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';

class Question extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            correct: 0,
            incorrect: 0,
            checked: false
        }
    }

    static contextTypes = {
        router: PropTypes.object,
    }

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
            console.log (answers[index]);
            console.log(question.questionAnswer);
            if (JSON.stringify(question.questionAnswer) == JSON.stringify(answers[index])) {
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
        const {handleSubmit, questionType, questions} = this.props;
        const {id} = this.props.params;

        if (!questions[id]) {
            return (
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <h2 className="display-2 text-xs-center">
                            No question found
                        </h2>
                    </div>
                </div>
            )
        }

        return (
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h3 className="display-2 text-center">
                        {questions[id].questionTitle}
                    </h3>
                    <form onSubmit={handleSubmit(this.quizHandler.bind(this))}>
                        <div className="form-group">
                       
                            <label htmlFor={`question${id}`}>Ваш ответ:</label>
                           {questions[id].questionType == "text" && 
                           <Field name={`${id}`} component="input" className="form-control" type="text"/>}
                           {questions[id].questionType == "radio" && 
                           <Grid>
                                    <Col sm={12}>
                                          <Field
                                           name={`${id}`}
                                           component={Radio}
                                           options={{
                                            yes: ' Да',
                                            no: ' Нет'
                                          }}
                                        />
                                    </Col>
                                 </Grid>
                             }
                           {questions[id].questionType == "checkbox" && 
                           <Grid>
                                    <Col sm={12}>
                       
                                    <Field name={`${id}`} component={CheckboxGroup} options=  {
                                        [{id: 1, name: ' Optoin 1'}, 
                                        {id: 2, name: ' Option 2'}, 
                                        {id: 3, name: ' Option 3'}]} />
                                    </Col>
                                 </Grid>
                             }
                            <Link
                                disabled={id == '0'}
                                to={`/question/${Number(id) - 1}`}
                                className={id == '0' ? "btn btn-danger float-xs-right disabled" : "btn btn-danger float-xs-right"}
                            >
                                Назад
                            </Link>
                            <button
                                disabled={this.state.checked}
                                type="submit"
                                className="btn btn-primary float-xs-right"
                            >
                                Вперед
                            </button>
                        </div>
                    </form>
                    {this.state.checked &&
                    <div className="row">
                            <h4>{this.state.correct} правильно, </h4>
                            <h4>{this.state.incorrect} не правильно </h4>
                        <Link to="/" className="btn btn-danger">Вернуться</Link>
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

export default Question = connect(mapStateToProps)(Question);

