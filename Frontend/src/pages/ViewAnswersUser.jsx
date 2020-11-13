import React, { Component } from 'react';
import axios from 'axios';
import { Button, Label, Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import web3 from '../ethereum/web3';
import instanceQuiz from '../ethereum/instanceQuiz';
import jwtDecode from 'jwt-decode';

class ViewAnswersUser extends Component {
    state = { 
        quiz: [],
        correctAnswers: [],
        userAnswers: [],
        isPrizeClaimed: '',
        marks: '',
        loading: false,
        disabled: false
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

            const isPrizeClaimed = await instance.methods.isPrizeClaimed(email).call();

            let marks = 0;
            for (let index = 0; index < correctAnswers.length; index++) {
                if(correctAnswers[index] == userAnswers[index])
                marks++;
            }
            this.setState({ correctAnswers, userAnswers, isPrizeClaimed, marks });
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
                        <Table.HeaderCell>{userAnswers[index]!=='0'? userAnswers[index] : '-'}</Table.HeaderCell>
                        <Table.HeaderCell>
                            { correctAnswers[index]==userAnswers[index]? <Label color="green" circular>Correct</Label> : <Label color="red" circular>Wrong</Label> }
                        </Table.HeaderCell>
                    </Table.Row>
                )
            });
        return res;
    }

    claimPrize = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            const { email } = jwtDecode(localStorage.getItem('token'));
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.props.history.location.state.quizContractAddress);
            await instance.methods.claimPrize(email, parseInt(this.state.marks)).send({ from: accounts[1] });
            toast.success('QuizCoins Received');
            this.setState({ isPrizeClaimed: true });
        } catch (error) {
            console.log("error--",error);
            toast.error("Unexpected Error");
        }
        this.setState({ loading: false, disabled: false });
    }

    render() { 
        return ( 
            <div className="container">
                <ToastContainer/>
                <h3>View Answers</h3>
                <h4>Marks : {this.state.marks}/{this.state.correctAnswers.length}</h4>
                <h4>Prize Won : {parseInt(this.state.marks*3/2)} QC</h4>
                { !this.state.isPrizeClaimed && 
                    <Button className="my-2" style={{float: "right"}} onClick={this.claimPrize} color="blue" loading={this.state.loading} disabled={this.state.disabled} >Claim Prize</Button> }
                { this.state.isPrizeClaimed && <Label color="pink" style={{float: 'right', marginBottom: 10}} size="large" circular>Prize Claimed</Label> }
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