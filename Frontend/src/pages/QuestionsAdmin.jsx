import React, { Component } from 'react';
import EditQuestion from './EditQuestion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Header, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import web3 from '../ethereum/web3';
import instanceQuiz from '../ethereum/instanceQuiz';

class QuestionsAdmin extends Component {
    state = { 
        quiz: [],
        questions: [],
        stage: '',
        quizContractAddress: '',
        loading: false,
        disabled: false
    }

    async componentDidMount() {
        const quiz = await axios.get('http://localhost:9000/api/quiz/' + this.props.match.params.id);
        const quizFactory = await axios.get('http://localhost:9000/api/quizFactory/' + this.props.match.params.id);
        const quizContractAddress = quizFactory.data.quizContractAddress;

        const accounts = await web3.eth.getAccounts();
        const instance = await instanceQuiz(quizContractAddress);
        const stage = await instance.methods.getStage().call();
        
        this.setState({quiz: quiz.data, questions: quiz.data.questions, stage, quizContractAddress });
    }

    deleteQuestion = async (questionId) => {
        try {
            const obj = {
                'id1': this.props.match.params.id,
                'id2': questionId
            };
            console.log("obj=",obj);
            const response = await axios.post('http://localhost:9000/api/quiz/removeQuestion', obj);
            console.log(response.data);
            toast.success("Question Deleted");
            const quiz = await axios.get('http://localhost:9000/api/quiz/' + this.props.match.params.id);
            this.setState({quiz: quiz.data, questions: quiz.data.questions});
        } catch (error) {
            console.log(error);
            toast.error("Unexpected Error");
        }
    }

    renderQuestions = () => {
        const res = this.state.questions.map((item,index) => {
                return (
                    <Table.Row key={index}>
                        <Table.HeaderCell>{item.question}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option1}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option2}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option3}</Table.HeaderCell>
                        <Table.HeaderCell>{item.option4}</Table.HeaderCell>
                        <Table.HeaderCell>
                            <Button color="olive" size="tiny" disabled={ this.state.stage > 1 } >
                                <Link to={{
                                        pathname: `/admin/question/edit/${item._id}` ,
                                        state: {
                                            quizId: this.props.match.params.id ,
                                            item: item
                                        } }} className="text-white" >    
                                    Edit
                                </Link>
                            </Button>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <Button color="red" size="tiny" onClick={() => {this.deleteQuestion(item._id)}} disabled={ this.state.stage > 1 } >
                                Delete
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                )
            });
        return res;
    }

    startReg = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.state.quizContractAddress);
            await instance.methods.startReg().send({ from: accounts[0] });
            toast.success("Registration Stage Started");
            this.setState({ stage: 1 });
        } catch (error) {
            console.log("error--",error);
            toast.error("Request Failed");
        }
        this.setState({ loading: false, disabled: false });
    }

    startQuiz = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.state.quizContractAddress);
            await instance.methods.startQuiz().send({ from: accounts[0] });

            const obj = {
                _id: this.props.match.params.id
            }
            const response = await axios.post('http://localhost:9000/api/quizFactory/addQuizStartedTime', obj);
            toast.success("Quiz has started");
            this.setState({ stage: 2 });
        } catch (error) {
            console.log("error--",error);
            toast.error("Request Failed");
        }
        this.setState({ loading: false, disabled: false });
    }

    endQuiz = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.state.quizContractAddress);
            await instance.methods.endQuiz().send({ from: accounts[0] });
            toast.success("Quiz Finished! It's the time to publish the answer key!");
            this.setState({ stage: 3 });
        } catch (error) {
            console.log("error--",error);
            toast.error("Request Failed");
        }
        this.setState({ loading: false, disabled: false });
    }

    deleteQuiz = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const instance = await instanceQuiz(this.state.quizContractAddress);
            await instance.methods.destroyContract(accounts[0]).send({ from: accounts[0] });
            console.log('Quiz contract deleted');

            const obj = {
                'id': this.props.match.params.id
            }
            const quiz = await axios.post("http://localhost:9000/api/quizFactory/removeQuiz", obj);

            this.setState({ loading: false, disabled: false });
            this.props.history.replace('/quizPageAdmin');
        } catch (error) {
            console.log("error--",error);
            toast.error("Request Failed");
            this.setState({ loading: false, disabled: false });
        }
    }

    render() { 
        return ( 
            <div className="container">
                <ToastContainer />
                {/* { this.showNotif() || toast.success('Done') } */}
                
                { this.state.stage == 0  && <Button color='green' className='mt-3 mx-2' onClick={this.startReg} loading={this.state.loading} disabled={this.state.disabled} >Start Registration</Button> }
                { this.state.stage == 1  && <Button color='green' className='mt-3 mx-2' onClick={this.startQuiz} loading={this.state.loading} disabled={this.state.disabled} >Start Quiz</Button> }
                { this.state.stage == 2  && <Button color='red' className='mt-3 mx-2' onClick={this.endQuiz} loading={this.state.loading} disabled={this.state.disabled} >End Quiz</Button> }
                { this.state.stage == 3  && <Link to={{ pathname: `/admin/publishAnswers/${this.props.match.params.id}` , 
                                                        state: {
                                                            quizContractAddress: this.state.quizContractAddress
                                                        } }}>
                                                <Button color='blue' className='mt-3 mx-2'>Publish Answers</Button>
                                            </Link> }
                { this.state.stage == 4  && <Button color='pink' className='mt-3 mx-2' onClick={this.deleteQuiz } loading={this.state.loading} disabled={this.state.disabled} >Delete Quiz</Button> }
                { this.state.stage < 2  && <Link to={`/admin/newQuestion/${this.props.match.params.id}`} style={{float:"right"}} ><Button color='blue' className='mt-3 mx-2 px-2'>+ Add Question</Button></Link> }

                { this.state.questions.length>0 ? (
                <Table celled selectable textAlign="center" verticalAlign="middle" unstackable className="font-weight-light" style={{background: 'linear-gradient(to right bottom, rgba(254,230,104,1), rgba(242,37,212,1))'}}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell className="bg-dark text-white">Question</Table.HeaderCell>
                            <Table.HeaderCell className="bg-dark text-white">Option 1</Table.HeaderCell>
                            <Table.HeaderCell className="bg-dark text-white">Option 2</Table.HeaderCell>
                            <Table.HeaderCell className="bg-dark text-white">Option 3</Table.HeaderCell>
                            <Table.HeaderCell className="bg-dark text-white">Option 4</Table.HeaderCell>
                            <Table.HeaderCell className="bg-dark text-white">Edit</Table.HeaderCell>
                            <Table.HeaderCell className="bg-dark text-white">Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderQuestions()}
                    </Table.Body>
                </Table>
                ) : (<h1>No Questions</h1>)}
            </div>
         );
    }
}
 
export default QuestionsAdmin;