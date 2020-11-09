import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';
import web3 from '../ethereum/web3';
import jwtDecode from 'jwt-decode';
import instanceQuiz from '../ethereum/instanceQuiz';

class AttemptQuiz extends Component {
   
    submitForm = React.createRef();

    state = { 
        questions: [],
        answers: '',
        loading: false,
        disabled: false,
        quizStartedTime: '',
        duration: 960,
        minutes: '',
        seconds: ''
     }

    async componentDidMount() {
        const quiz = await axios.get('http://localhost:9000/api/quiz/' + this.props.match.params.id);
        const quizFactory = await axios.get('http://localhost:9000/api/quizFactory/' + this.props.match.params.id);
        const quizStartedTime = quizFactory.data.quizStartedTime;
        this.setState({ questions: quiz.data.questions, quizStartedTime });

        const timeElapsed = (Date.now() - quizStartedTime)/1000;
        console.log(timeElapsed);

        if(timeElapsed > this.state.duration) {
            //window.location(`user/quiz/${this.props.match.params.id}`);
            this.props.history.replace(`/user/quiz/${this.props.match.params.id}`);
        }

        if(timeElapsed < this.state.duration) {
            let seconds = this.state.duration - timeElapsed;
            let minutes = parseInt(seconds/60);
            seconds = parseInt(seconds%60);
            this.setState({ minutes, seconds });

            this.myInterval = setInterval(() => {
                const { seconds, minutes } = this.state;
    
                if (seconds > 0) {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1
                    }))
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(this.myInterval);
                        this.submitForm.current.submit();
                    } else {
                        this.setState(({ minutes }) => ({
                            minutes: minutes - 1,
                            seconds: 59
                        }))
                    }
                } 
            }, 1000);
        }

    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const answers = {...this.state.answers};
        answers[name] = value;
        this.setState({ answers });
    }

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.setState({ loading: true, disabled: true });
        
    //     let size = 0;
    //     const { answers } = this.state;
    //     console.log(answers);
    //     for (const key in answers) {
    //         if (answers.hasOwnProperty(key)) {
    //             ++size;
    //         }
    //     }
    //     if(size != this.state.questions.length){
    //         toast.error("Please provide all answers!");
    //         this.setState({ loading: false, disabled: false });
    //     }
    //     else
    //         this.doSubmit();
    // }

    doSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, disabled: true });
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
                if(!(answers.hasOwnProperty(question._id)))
                    ansKey.push(parseInt(0));
            });

            console.log(ansKey);
            const { email } = jwtDecode(localStorage.getItem("token"));
            // const obj = {
            //     'user': {
            //         'email': email,
            //         'isCompleted': true,
            //         'answers': ansKey
            //     }
            // }
            // const res = await axios.post('http://localhost:9000/api/answers/addUserAnswers/' + this.props.match.params.id, obj);
            // console.log("answersAddedRes=",res.data);
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.props.history.location.state.quizContractAddress);
            await instance.methods.setUserAnswers(email, ansKey).send({ from: accounts[1] });

            this.setState({ loading: false, disabled: false });
            this.props.history.replace('/user/quiz/' + this.props.match.params.id);
        } catch (error) {
            console.log("error--",error);
            toast.error('Unexpected Error');
            this.setState({ loading: false, disabled: false });
        }
    }

    renderForm = () => {
        const questions = this.state.questions.map((question,index) => {
            return (
                <div key={index} className="my-3">
                    <label>{question.question}</label>
                    <br/>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="1" onChange={this.handleChange} checked={this.state.answers[question._id] == '1'} />
                        <label className="form-check-label">{question.option1}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="2" onChange={this.handleChange} checked={this.state.answers[question._id] == '2'} />
                        <label className="form-check-label">{question.option2}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="3" onChange={this.handleChange} checked={this.state.answers[question._id] == '3'} />
                        <label className="form-check-label">{question.option3}</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name={question._id} value="4" onChange={this.handleChange} checked={this.state.answers[question._id] == '4'} />
                        <label className="form-check-label">{question.option4}</label>
                    </div>
                </div>
            );
        });
        return questions;
    }

    render() { 
        const { minutes, seconds } = this.state;
        return ( 
            <div className="container">
                <ToastContainer />
                <h2>Attempt Quiz</h2>
                <div>
                { minutes === 0 && seconds === 0
                    ? <h1>Busted!</h1>
                    : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                }
            </div>
                <form ref={this.submitForm} onSubmit={this.doSubmit}>
                    {this.renderForm()}
                    <Button type="submit" color="green" size="tiny" loading={this.state.loading} disabled={this.state.disabled} >Finish Attempt</Button>
                </form>
            </div>
         );
    }
}
 
export default AttemptQuiz;