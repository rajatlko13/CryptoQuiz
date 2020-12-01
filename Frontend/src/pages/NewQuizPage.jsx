import React, { Component } from 'react';
import axios from 'axios';
import Joi from 'joi-browser';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import web3 from '../ethereum/web3';
import instanceQuizFactory from '../ethereum/instanceQuizFactory';
import { addressEIP20 } from '../ethereum/addressConfig.json';
import NewQuizSvg from '../images/newQuizSvg';
 
class NewQuizPage extends Component {
    
    state = { 
        quiz: {
            name: '',
            description: '',
            regStartDate: '',
            regStartTime: '',
            playStartDate: '',
            playStartTime: '',
            regCost: '',
            duration: ''
        },
        error: {},
        loading: false,
        disabled: false
    }

    schema = {
        name: Joi.string().required().label('Quiz Name'),
        description: Joi.string().required().label('Description'),
        regStartDate: Joi.date().min('now').required().label('Reg Start Date'),
        regStartTime: Joi.string().required().label('Reg Start Time'),
        playStartDate: Joi.date().min('now').required().label('Quiz Start Date'),
        playStartTime: Joi.string().required().label('Play Start Time'),
        regCost: Joi.number().min(0).required().label('Registration Cost'),
        duration: Joi.number().min(1).required().label('Duration')
    }

    validate = () => {
        console.log("validate form");
        const { error } = Joi.validate(this.state.quiz, this.schema);
        if(!error) 
            return null;
        console.log(error);

        const errors = {};
        for(let item of error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    validateProperty = (name, value) => {
        const schema = {
            [name]: this.schema[name]
        }
        const obj = {
            [name]: value
        }
        const {error} = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        const error = { ...this.state.error };
        const errorMessage = this.validateProperty(name,value);
        if (errorMessage) error[name] = errorMessage;
        else delete error[name];

        const quiz = {...this.state.quiz};
        quiz[name] = value;
        this.setState({ quiz, error });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handling form");

        const errors = this.validate();
        this.setState({error : errors || {}});
        if(errors)
            return;
        this.doSubmit();
    }

    doSubmit = async () => {
        this.setState({ loading: true, disabled: true });
        try {
            console.log("submitting form");
            const response = await axios.post('http://localhost:9000/api/quizFactory/addQuiz', this.state.quiz);

            const accounts = await web3.eth.getAccounts();
            await instanceQuizFactory.methods.createQuiz(addressEIP20, response.data._id)
                .send({from: accounts[0]});
            const address = await instanceQuizFactory.methods.getDeployedQuizzes(response.data._id).call();

            const obj = {
                '_id': response.data._id,
                'address': address
            };
            const quiz = await axios.post('http://localhost:9000/api/quizFactory/addContractAddress', obj);
            this.setState({ loading: false, disabled: false });
            this.props.history.push("/quizPageAdmin");
        } catch (error) {
            console.log('error----',error.response);
            this.setState({ loading: false, disabled: false });
            toast.error("Invalid Details");
        }
    }

    render() { 
        return ( 
            <React.Fragment>
                {/* <h1>Hello {this.props.match.params.id}</h1> */}
                <ToastContainer />
                <div className='pb-4'>
                    <div className="my-5 mx-auto" style={{width: '40vw', fontFamily: 'Goldman', border: '3px solid rgb(243,9,212)', boxShadow: '5px 5px 15px rgb(243,9,212)', background: 'linear-gradient(to right bottom, rgba(104,177,249,0.9), rgba(243,9,212,0.9))' }}>
                        <h3 className="text-center my-3" style={{fontFamily: 'Goldman'}}>Create New Quiz</h3>
                        <hr className="w-25 mx-auto text-dark font-weight-bolder" />
                        <div className="text-center my-4">
                            <NewQuizSvg width='130px' />
                        </div>
                        <form onSubmit={this.handleSubmit} className="px-3"> 
                            <div className="form-group my-2">
                                <label>Quiz Name</label>
                                <input name="name" type="text" className="form-control" style={{fontFamily: 'Goldman'}} id="exampleInputName1" value={this.state.quiz.name} onChange={this.onChange} />
                                {this.state.error.name && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.name}</div>}
                            </div>
                            <div className="form-group my-2">
                                <label>Description</label>
                                <textarea name="description" type="text" className="form-control" style={{fontFamily: 'Goldman'}} id="exampleInputDescription1" value={this.state.quiz.description} onChange={this.onChange}/>
                                {this.state.error.description && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.description}</div>}
                            </div>
                            <div className='row'>
                                <div className="form-group my-2 col-lg-6">
                                    <label>Registration Start Date</label>
                                    <input name="regStartDate" type="Date" className="form-control" style={{fontFamily: 'Goldman'}} id="regStartDate" value={this.state.quiz.regStartDate} onChange={this.onChange}/>
                                    {this.state.error.regStartDate && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.regStartDate}</div>}
                                </div>
                                <div className="form-group my-2 col-lg-6">
                                    <label>Registration Start Time</label>
                                    <input name="regStartTime" type="time" className="form-control" style={{fontFamily: 'Goldman'}} id="regStartTime" value={this.state.quiz.regStartTime} onChange={this.onChange}/>
                                    {this.state.error.regStartTime && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.regStartTime}</div>}
                                </div>
                            </div>
                            <div className='row'>
                                <div className="form-group my-2 col-lg-6">
                                    <label>Quiz Start Date</label>
                                    <input name="playStartDate" type="Date" className="form-control" style={{fontFamily: 'Goldman'}} id="playStartDate" value={this.state.quiz.playStartDate} onChange={this.onChange}/>
                                    {this.state.error.playStartDate && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.playStartDate}</div>}
                                </div>
                                <div className="form-group my-2 col-lg-6">
                                    <label>Quiz Start Time</label>
                                    <input name="playStartTime" type="time" className="form-control" style={{fontFamily: 'Goldman'}} id="playStartTime" value={this.state.quiz.playStartTime} onChange={this.onChange}/>
                                    {this.state.error.playStartTime && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.playStartTime}</div>}
                                </div>
                            </div>
                            <div className='row'>
                                <div className="form-group my-2 col-lg-6">
                                    <label>Registration Cost</label>
                                    <div className="input-group">
                                        <input name="regCost" type="number" className="form-control" style={{fontFamily: 'Goldman'}} id="regCost" value={this.state.quiz.regCost} onChange={this.onChange}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">QC</span>
                                        </div>
                                    </div>
                                    {this.state.error.regCost && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.regCost}</div>}
                                </div>
                                <div className="form-group my-2 col-lg-6">
                                    <label>Duration</label>
                                    <div className="input-group">
                                        <input name="duration" type="number" className="form-control" style={{fontFamily: 'Goldman'}} id="duration" value={this.state.quiz.duration} onChange={this.onChange}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text">minutes</span>
                                        </div>
                                    </div>
                                    {this.state.error.duration && <div className="my-2" style={{color: 'cyan'}}>{this.state.error.duration}</div>}
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <Button type="submit" color='green' loading={this.state.loading} disabled={this.state.disabled} className="px-2 font-weight-light" style={{fontFamily: 'Goldman'}}>Create Quiz</Button>
                                <Link to='/quizPageAdmin'>
                                    <button type="reset" style={{fontFamily: 'Goldman'}} className="btn btn-dark border-2 mx-2 my-3">Cancel</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default NewQuizPage;