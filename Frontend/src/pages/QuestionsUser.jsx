import React, { Component } from 'react';
import EditQuestion from './EditQuestion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Header, Icon, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import web3 from '../ethereum/web3';
import instanceQuiz from '../ethereum/instanceQuiz';
import instanceEIP20 from '../ethereum/instanceEIP20';
import { addressQuizFactory } from '../ethereum/addressConfig.json';
import jwtDecode from 'jwt-decode';

class QuestionsUser extends Component {
    state = { 
        quiz: '',
        stage: '',
        quizContractAddress: '',
        isRegistered: '',
        hasAttempted: '',
        loading: false,
        disabled: false
    }

    async componentDidMount() {
        try {
            const quizFactory = await axios.get('http://localhost:9000/api/quizFactory/' + this.props.match.params.id);
            const quizContractAddress = quizFactory.data.quizContractAddress;

            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(quizContractAddress);
            const stage = await instance.methods.getStage().call();
            this.setState({ quiz: quizFactory.data, stage, quizContractAddress });

            const { email } = jwtDecode(localStorage.getItem("token"));
            // const isReg = await axios.get('http://localhost:9000/api/answers/isRegistered/' + this.props.match.params.id + '/' + email);
            // console.log("isReg=",isReg);
            const isReg = await instance.methods.isUserRegistered(email).call();
            this.setState({ isRegistered: isReg });

            // const attempted = await axios.get('http://localhost:9000/api/answers/hasAttempted/' + this.props.match.params.id + '/' + email);
            // console.log("hasAttempted=",attempted.data);
            const attempted = await instance.methods.isQuizAttempted(email).call();
            this.setState({ hasAttempted: attempted });
        } catch (error) {
            console.log("error-",error);
        }
    }

    regQuiz = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            const { email } = jwtDecode(localStorage.getItem("token"));
            // const user = {
            //     'email': email,
            //     'quizCompleted': false
            // };
            // const res = await axios.post('http://localhost:9000/api/answers/registerUser/' + this.props.match.params.id, { user });
            const accounts = await web3.eth.getAccounts();
            const instanceEIP = await instanceEIP20;
            await instanceEIP.methods.transfer(addressQuizFactory, 5).send({ from: accounts[1] });
            const instance = await instanceQuiz(this.state.quizContractAddress);
            await instance.methods.registerUser(email).send({ from: accounts[1] });
            toast.success("Registration Successful!");
            this.setState({ isRegistered: true });
        } catch (error) {
            console.log("error--",error);
            toast.error("Request Failed");
        }
        this.setState({ loading: false, disabled: false });
    }

    // isRegistered = async() => {
    //     try {
    //         const { email } = jwtDecode(localStorage.getItem("token"));
    //         const res = await axios.get('http://localhost:9000/api/answers/isRegistered/' + email);
    //         if(res)
    //             return true;
    //         else
    //             return false;
    //     } catch (error) {
    //         console.log("error-",error);
    //         toast.error("Request Failed");
    //     }
    // }

    // startQuiz = async () => {
    //     this.setState({ loading: true, disabled: true });
    //     try {
    //         const accounts = await web3.eth.getAccounts();
    //         const instance = await instanceQuiz(this.state.quizContractAddress);
    //         await instance.methods.startQuiz().send({ from: accounts[0] });
    //         toast.success("Quiz has started");
    //         this.setState({ stage: 2 });
    //     } catch (error) {
    //         console.log("error--",error);
    //         toast.error("Request Failed");
    //     }
    //     this.setState({ loading: false, disabled: false });
    // }

    render() { 

        const { isRegistered, hasAttempted }  = this.state;
        return ( 
            <div className="container">
                <ToastContainer />
                <h5>Welcome to QuestionsUser</h5>
                <label style={{fontWeight: 'bold'}}>Quiz Title :</label> <p>{this.state.quiz.name}</p>
                <label style={{fontWeight: 'bold'}}>Description :</label> <p>{this.state.quiz.description}</p>
                { this.state.stage == 0 && <h5>Registrations will begin shortly...</h5>}
                { this.state.stage == 1 && !isRegistered  && <Button color='blue' className='mt-3 mx-2' onClick={this.regQuiz} loading={this.state.loading} disabled={this.state.disabled} >Register</Button> }
                { this.state.stage == 1 && isRegistered  && <Label color="green" size="large" circular>Registered</Label> }
                { this.state.stage > 1 && !isRegistered && <h5>Registrations Closed! You have not registered for this Quiz.</h5>}
                { this.state.stage == 2 && isRegistered && !hasAttempted && <Link to={{ pathname: "/user/attemptQuiz/" + this.props.match.params.id, 
                                                                                        state: {
                                                                                            quizContractAddress: this.state.quizContractAddress
                                                                                        }   }} >
                                                                                <Button color='green' className='mt-3 mx-2'>Start Quiz</Button>
                                                                            </Link> }
                { this.state.stage == 2 && hasAttempted && <Label color="red" size="large" circular>Quiz Attempted</Label> }
                { this.state.stage == 3 && isRegistered && <Label color="olive" size="large" circular>Answers Key will be released shortly...</Label>}
                { this.state.stage == 4 && isRegistered  && <Link to={{ pathname: `/user/viewAnswers/${this.props.match.params.id}` , 
                                                                        state: {
                                                                            quizContractAddress: this.state.quizContractAddress
                                                                        } }}>
                                                                <Button color='blue' className='mt-3 mx-2'>View Answers</Button>
                                                            </Link> }
            </div>
         );
    }
}
 
export default QuestionsUser;