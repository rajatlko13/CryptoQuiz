import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

class QuizPageAdmin extends Component {
    
    state = {
        quizList: []
    }

    async componentDidMount() {
        const quizList = await axios.get('http://localhost:9000/api/quizFactory');
        this.setState({quizList: quizList.data});
    }

    renderQuizList = () => {
        const list = this.state.quizList.map((quiz,index) => {
            return (
                <div className="col-lg-4 my-3" key={index} >
                    <Card>
                        <Card.Content key={quiz.name} header={quiz.name} />
                        <Card.Content key={quiz.description} description={quiz.description} />
                        <Card.Content key={index} extra>
                            <Link key='1' to={`/admin/quiz/${quiz._id}`} >
                                <Button color='blue'>View</Button>
                            </Link>
                        </Card.Content>
                    </Card>
                </div>
            );
        });
        return list;
    }

    render() { 
        return ( 
            <div className="mx-2 my-2">
                <h5>Welcome to QuizPageAdmin</h5>
                <Link to="/admin/newQuiz"><Button color="green" className="my-3">+ Create New Quiz</Button></Link>
                <div className="row container mx-auto">
                    { this.state.quizList.length? this.renderQuizList() : <h1>No Quiz Available</h1>}
                </div>
            </div>
            // <Link to="/admin/questions" key='1'><Button color='red' className='mt-3'>View</Button></Link>
         );
    }
}
 
export default QuizPageAdmin;