import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Radio from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import { Grid, Col, Button, ButtonGroup } from 'react-bootstrap';
import {deleteQuestion, editQuestion} from '../actions/index';


class QuestionItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editView: false,
            questionTitle: '',
            questionAnswer: '',
            questionCounterAnswer: 2,
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
            
            questionId: this.props.index
        })
        this.setState({editView: false});
    }

    toggleEdit() {
        this.state.editView ? this.setState({editView: false}) : this.setState({editView: true});
    }

    render() {
        const {question, questionType, deleteQuestion} = this.props;
        return (
            <li className="list-group-item">
                <h5 className="list-group-item-heading">{question.questionTitle}</h5>
                <p className="list-group-item-text">Ответ: {question.questionAnswer}</p>
                <button
                    onClick={this.toggleEdit.bind(this)}
                    className="btn btn-default float-right">
                    Редактировать
                </button>
                <button
                    onClick={deleteQuestion.bind(this, question.questionTitle)}
                    className="btn btn-danger float-right">
                    Удалить
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
                        {question.questionType == "text" && 
                        <input
                            onChange={this.handleChange.bind(this, 'questionAnswer')}
                            name="questionAnswer"
                            type="text"
                            className="form-control"
                        />}
                        {question.questionType == "radio" && 
                           <Grid>
                                    <Col sm={12}>
                                          <Field
                                           name="questionAnswer"
                                           component={Radio}
                                           options={{
                                            yes: ' Yes',
                                            no: ' No'
                                          }}
                                        />
                                    </Col>
                                 </Grid>
                             }
                           {question.questionType == "checkbox" && 
                           <Grid>
                                    <Col sm={12}>
                       
                                    <Field name="questionAnswer" component={CheckboxGroup} options=  {
                                        [{id: 1, name: ' Optoin 1'}, 
                                        {id: 2, name: ' Option 2'}, 
                                        {id: 3, name: ' Option 3'}]} />
                                    </Col>
                                 </Grid>
                             }
                    </div>
                    <button type="submit" className="btn btn-primary float-right">Применить</button>
                </form>}
            </li>
        )
    }
}

export default QuestionItem = connect(null, {deleteQuestion, editQuestion})(QuestionItem);