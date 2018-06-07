import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {reduxForm, Field, formValueSelector} from 'redux-form';
import 'bootstrap/dist/css/bootstrap.css';
import { Grid, Col, Button, ButtonGroup } from 'react-bootstrap';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Radio from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import {createQuestion} from '../actions/index';
import QuestionItem from './question-item';



class Home extends React.Component {
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
                <div className="col-md-12">
                    <h2 className="display-1 text-center">Quiz Builder</h2>

                    <form onSubmit={handleSubmit(this.createQuestionHandler.bind(this))}>
                        <div className="form-group">
                            <h4>Определите тип вопроса:</h4>
                            <ButtonGroup>
                            <Button bsStyle="primary"><Field name="questionType" component="input" type="radio" value="radio"/>
                             Да/Нет
                            </Button>
                            <Button bsStyle="primary"><Field name="questionType" component="input" type="radio" value="text"/>
                            Текст
                            </Button>
                            <Button bsStyle="primary"><Field name="questionType" component="input" type="radio" value="checkbox"/>
                            Чекбокс
                            </Button>
                            </ButtonGroup>
                        </div>
                        <div className="form-group">
                            <label htmlFor="questionTitle">Название вопроса:</label>
                            <Field name="questionTitle" className="form-control" component="input" type="text"/>
                        </div>
                        {questionType == "text" && <div className="form-group">
                            <label htmlFor="questionAnswer">Ответ на вопрос:</label>
                            <Field name="questionAnswer" className="form-control" component="input" type="text"
                            />
                        </div>}
                        {questionType == "radio" && <div className="form-group">
                            <label htmlFor="questionAnswer">Ответ на вопрос: </label>
                                <Grid>
                                    <Col sm={12}>
                                          <Field
                                           name="questionAnswer"
                                           component={Radio}
                                           options={{
                                            yes: ' Да',
                                            no: ' Нет'
                                          }}
                                        />
                                    </Col>
                                 </Grid>
                        </div>}
                        {questionType == "checkbox" && <div className="form-group">
                            <label htmlFor="questionAnswer">Ответ на вопрос:</label>
                                <Grid>
                                    <Col sm={12}>
                       
                                    <Field name="questionAnswer" component={CheckboxGroup} options=  {
                                        [{id: 1, name: ' Optoin 1'}, 
                                        {id: 2, name: ' Option 2'}, 
                                        {id: 3, name: ' Option 3'}]} />
                                    </Col>
                                 </Grid>
                        </div>}
                        <button type="submit" className="btn btn-primary float-right">Добавить вопрос</button>
                    </form>
                    {error == 'true' &&
                    <div className="alert alert-danger" role="alert">
                        Вопрос не сохранен!
                    </div>
                    }
                    {error == 'false' &&
                    <div className="alert alert-success" role="alert">
                        Вопрос сохранен!
                    </div>
                    }
                    <h4>Вопросы</h4>
                    <div className="list-group">
                        {questions.map(this.renderQuestions)}
                    </div>
                    <Link to={"question/0"} className="btn btn-primary float-right">Режим просмотра</Link>
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

export default Home = connect(mapStateToProps, {createQuestion})(Home);