import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import web3 from '../ethereum/web3';
import instanceQuiz from '../ethereum/instanceQuiz';
import jwtDecode from 'jwt-decode';

class ViewAnswersUser extends Component {
    state = { 
        quiz: [],
        correctAnswers: '',
        userAnswers: ''
     }

    async componentDidMount() {
        try {
            const { email } = jwtDecode(localStorage.getItem('token'));
            const quiz = await axios.get('http://localhost:9000/api/quiz/' + this.props.match.params.id);
            this.setState({ quiz: quiz.data.questions });

            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.props.history.location.state.quizContractAddress);
            const correctAnswers = await instance.methods.getAnswerKey().call();
            const userAnswers = await instance.methods.getUserAnswers(email).call();
            
            this.setState({ correctAnswers, userAnswers });
            
        } catch (error) {
            console.log("error--",error);
            toast.error("Unexpected Error");
        }
    }

    renderQuestions = () => {
        const { correctAnswers, userAnswers } = this.state;
        const res = this.state.quiz.map((item,index) => {
                return (
                    <Table.Row key={index}>
                        <Table.HeaderCell>{item.question}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option1}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option2}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option3}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option4}</Table.HeaderCell>
                        <Table.HeaderCell>{correctAnswers[index]}</Table.HeaderCell>
                        <Table.HeaderCell>{userAnswers[index]}</Table.HeaderCell>
                        <Table.HeaderCell>
                            { correctAnswers[index]==userAnswers[index]? "Correct" : "Wrong" }
                        </Table.HeaderCell>
                    </Table.Row>
                )
            });
        return res;
    }

    render() { 
        return ( 
            <div className="container">
                <h3>View Answers</h3>
                <Table celled color='black' striped selectable inverted textAlign="center" verticalAlign="middle" unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Question</Table.HeaderCell>
                            <Table.HeaderCell>Option 1</Table.HeaderCell>
                            <Table.HeaderCell>Option 2</Table.HeaderCell>
                            <Table.HeaderCell>Option 3</Table.HeaderCell>
                            <Table.HeaderCell>Option 4</Table.HeaderCell>
                            <Table.HeaderCell>Correct Answer</Table.HeaderCell>
                            <Table.HeaderCell>Your Answer</Table.HeaderCell>
                            <Table.HeaderCell>Result</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderQuestions()}
                    </Table.Body>
                </Table>
            </div>
         );
    }
}
 
export default ViewAnswersUser;