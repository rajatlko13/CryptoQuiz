import React, { Component } from 'react';
import axios from 'axios';
import Joi from 'joi-browser';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

class NewQuestionPage extends Component {
    state = { 
        item: {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: ''
        },
        error: {}
    }

    schema = {
        question: Joi.string().required().label('Question'),
        option1: Joi.string().required().label('Option 1'),
        option2: Joi.string().required().label('Option 2'),
        option3: Joi.string().required().label('Option 3'),
        option4: Joi.string().required().label('Option 4')
    }

    validate = () => {
        console.log("validate form");
        const { error } = Joi.validate(this.state.item, this.schema, { abortEarly : false });
        if(!error) 
            return null;

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

        const item = {...this.state.item};
        item[name] = value;
        this.setState({ item, error });
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
        try {
            console.log("submitting form");
            const question = {...this.state.item};
            question['id'] = this.props.match.params.id;
            const response = await axios.post('http://localhost:9000/api/quiz/addQuestion', question);
            this.props.history.replace("/admin/quiz/"+this.props.match.params.id);
        } catch (error) {
            console.log('error----',error.response);
            toast.error("Invalid Details");
        }

    }

    render() { 
        return ( 
            <React.Fragment>
                {/* <h1>Hello {this.props.match.params.id}</h1> */}
                <ToastContainer />
                <h2 className="text-center">Add New Question</h2>
                <form className="container w-50" onSubmit={this.handleSubmit}>   
                    <div className="form-group my-2">
                        <label>Question</label>
                        <input name="question" type="text" className="form-control" id="exampleInputQuestion1" value={this.state.item.question} onChange={this.onChange} />
                    </div>
                    {this.state.error.question && <div className="alert alert-danger my-2">{this.state.error.question}</div>}
                    <div className="form-group my-2">
                        <label>Option 1</label>
                        <input name="option1" type="text" className="form-control" id="exampleInputOption1" value={this.state.item.option1} onChange={this.onChange}/>
                    </div>
                    {this.state.error.option1 && <div className="alert alert-danger my-2">{this.state.error.option1}</div>}
                    <div className="form-group my-2">
                        <label>Option 2</label>
                        <input name="option2" type="text" className="form-control" id="exampleInputOption2" value={this.state.item.option2} onChange={this.onChange}/>
                    </div>
                    {this.state.error.option2 && <div className="alert alert-danger my-2">{this.state.error.option2}</div>}
                    <div className="form-group my-2">
                        <label>Option 3</label>
                        <input name="option3" type="text" className="form-control" id="exampleInputOption3" value={this.state.item.option3} onChange={this.onChange}/>
                    </div>
                    {this.state.error.option3 && <div className="alert alert-danger my-2">{this.state.error.option3}</div>}
                    <div className="form-group my-2">
                        <label>Option 4</label>
                        <input name="option4" type="text" className="form-control" id="exampleInputOption4" value={this.state.item.option4} onChange={this.onChange}/>
                    </div>
                    {this.state.error.option4 && <div className="alert alert-danger my-2">{this.state.error.option4}</div>}
                
                    <Link to={'/admin/quiz/'+ this.props.match.params.id}>
                        <button className="btn btn-secondary mx-2 my-3">Back</button>
                    </Link>
                    <button type="submit" className="btn btn-primary mx-2 my-3">Add Question</button>
                </form>
            </React.Fragment>
        );
    }
}
 
export default NewQuestionPage;