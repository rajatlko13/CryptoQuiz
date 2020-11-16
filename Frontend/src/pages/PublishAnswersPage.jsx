import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import web3 from '../ethereum/web3';
import instanceQuiz from '../ethereum/instanceQuiz';
import instanceEIP20 from '../ethereum/instanceEIP20';

class PublishAnswersPage extends Component {
    state = { 
        questions: [],
        answers: '',
        regCost: 0,
        loading: false,
        disabled: false
     }

    async componentDidMount() {
        const quiz = await axios.get('http://localhost:9000/api/quiz/' + this.props.match.params.id);
        const quizFactory = await axios.get('http://localhost:9000/api/quizFactory/' + quiz.data.quizId);
        this.setState({ questions: quiz.data.questions, regCost: quizFactory.data.regCost});
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const answers = {...this.state.answers};
        answers[name] = value;
        this.setState({ answers });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true, disabled: true });
        
        let size = 0;
        const { answers } = this.state;
        for (const key in answers) {
            if (answers.hasOwnProperty(key)) {
                ++size;
            }
        }
        if(size != this.state.questions.length){
            toast.error("Please provide all answers!");
            this.setState({ loading: false, disabled: false });
        }
        else
            this.doSubmit();
    }

    doSubmit = async () => {
        console.log("submitted");
        try {

            const ansKey = [];
            const { answers } = this.state;
            this.state.questions.map(question => {
                for (const key in answers) {
                    if (answers.hasOwnProperty(key)) {
                        if((question._id).localeCompare(key) == 0) {
                            ansKey.push(parseInt(answers[key]));
                            break;
                        }
                    }
                }
            });

            console.log(ansKey);
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.props.history.location.state.quizContractAddress);
            const totalRegUsers = await instance.methods.totalRegUsers().call();
            await instance.methods.publishAnswers(ansKey).send({ from: accounts[0] });
            
            const coins = Math.floor(this.state.regCost * 3/2) * totalRegUsers;
            await instanceEIP20.methods.transfer(this.props.history.location.state.quizContractAddress, coins)
                                .send({ from: accounts[0]});

            this.setState({ loading: false, disabled: false });
            this.props.history.replace('/admin/quiz/' + this.props.match.params.id);
        } catch (error) {
            console.log("error--",error);
            toast.error('Unexpected Error');
            this.setState({ loading: false, disabled: false });
        }
    }

    renderForm = () => {
        const questions = this.state.questions.map((question,index) => {
            return (
                <div key={index} className="my-3 p-3" style={{color: 'white', fontSize: '16px', fontFamily: 'Goldman', border: '2px solid cyan', background: 'linear-gradient(to right bottom, rgba(0,200,255,0.8), rgba(250,190,0,0.7))'}}>
                    <label>{question.question}</label>
                    <br/>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="1" onChange={this.handleChange} checked={this.state.answers[question._id] == '1'} />
                        <label className="form-check-label pt-1">{question.option1}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="2" onChange={this.handleChange} checked={this.state.answers[question._id] == '2'} />
                        <label className="form-check-label pt-1">{question.option2}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="3" onChange={this.handleChange} checked={this.state.answers[question._id] == '3'} />
                        <label className="form-check-label pt-1">{question.option3}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="4" onChange={this.handleChange} checked={this.state.answers[question._id] == '4'} />
                        <label className="form-check-label pt-1">{question.option4}</label>
                    </div>
                </div>
            );
        });
        return questions;
    }

    render() { 
        return ( 
            <div className="container">
                <ToastContainer />
                <h2>Publish Answers</h2>
                <form onSubmit={this.handleSubmit}>
                    {this.renderForm()}
                    <Button type="submit" color="green" size='small' className="px-2" style={{fontFamily: 'Goldman', fontWeight: 'normal'}} loading={this.state.loading} disabled={this.state.disabled}>Publish Answers</Button>
                </form>
            </div>
         );
    }
}
 
export default PublishAnswersPage;