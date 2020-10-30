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
 
class NewQuizPage extends Component {
    
    state = { 
        quiz: {
            name: '',
            description: ''
        },
        error: {},
        loading: false,
        disabled: false
    }

    schema = {
        name: Joi.string().required().label('Quiz Name'),
        description: Joi.string().required().label('Description')
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
            console.log("quiz=",quiz);
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
                <h2 className="text-center">Create New Quiz</h2>
                <form className="container w-25" onSubmit={this.handleSubmit}>   
                    <div className="form-group my-2">
                        <label>Quiz Name</label>
                        <input name="name" type="text" className="form-control" id="exampleInputName1" value={this.state.quiz.name} onChange={this.onChange} />
                    </div>
                    {this.state.error.name && <div className="alert alert-danger my-2">{this.state.error.name}</div>}
                    <div className="form-group my-2">
                        <label>Description</label>
                        <input name="description" type="text" className="form-control" id="exampleInputDescription1" value={this.state.quiz.description} onChange={this.onChange}/>
                    </div>
                    {this.state.error.description && <div className="alert alert-danger my-2">{this.state.error.description}</div>}
            
                    <Link to='/quizPageAdmin'>
                        <button type="reset" className="btn btn-secondary mx-2 my-3">Cancel</button>
                    </Link>
                    <Button type="submit" color="blue" loading={this.state.loading} disabled={this.state.disabled} className="mx-2 my-3">Create Quiz</Button>
                </form>
            </React.Fragment>
         );
    }
}
 
export default NewQuizPage;