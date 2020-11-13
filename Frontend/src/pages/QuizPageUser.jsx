import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Card, Button, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

class QuizPageUser extends Component {
    
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
                    <Card style={{background: 'linear-gradient( to right bottom, rgba(141,63,252,1), rgba(68,242,134,0.8))', border: '2px solid rgb(68,242,134)', boxShadow: '2px 2px 10px rgb(68,242,134)'}}>
                        <Card.Content key={quiz.name} className="py-2"><Label color="orange" size='large' ribbon>{quiz.name}</Label></Card.Content>
                        <Card.Content key={quiz.description} className="text-white">{quiz.description}</Card.Content>
                        <Card.Content key={index} extra>
                            <Link key='1' to={`/user/quiz/${quiz._id}`} >
                                <Button color='teal' inverted className="font-weight-light" style={{fontFamily: 'Goldman'}}>View</Button>
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
            <div className="container" style={{fontFamily: 'Goldman'}}>
                <div className="row my-3">
                    { this.state.quizList.length? this.renderQuizList() : <h1 style={{fontFamily: 'Goldman'}}>No Quiz Available</h1>}
                </div>
            </div>
            // <Link to="/admin/questions" key='1'><Button color='red' className='mt-3'>View</Button></Link>
         );
    }
}
 
export default QuizPageUser;