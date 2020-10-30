import React, {Component} from 'react';
import Joi from 'joi-browser';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

class UpdateQuestionModal extends Component {
    state = { 
        item: {
            _id: this.props.item._id,
            question: this.props.item.question,
            option1: this.props.item.option1,
            option2: this.props.item.option2,
            option3: this.props.item.option3,
            option4: this.props.item.option4
        },
        error: {}
    }

    // componentDidMount = () => {
    //     console.log('component mount');
    //     const { _id, question, option1, option2, option3, option4 } = this.props.item;
    //     const item = { _id, question, option1, option2, option3, option4 };
    //     this.setState({item});
    // }

    schema = {
        _id: Joi.required(),
        question: Joi.string().required().label('Question'),
        option1: Joi.string().required().label('Option 1'),
        option2: Joi.string().required().label('Option 2'),
        option3: Joi.string().required().label('Option 3'),
        option4: Joi.string().required().label('Option 4')
    }

    validate = () => {
        const { error } = Joi.validate(this.state.item, this.schema);
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
        //console.log(error.details);
        return error ? error.details[0].message : null;
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        const error = { ...this.state.error };
        const errorMessage = this.validateProperty(name,value);
        //console.log(errorMessage);
        if (errorMessage) error[name] = errorMessage;
        else delete error[name];
        const item = {...this.state.item};
        item[name] = value;
        this.setState({ item, error });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({error : errors || {}});
        if(errors)
            return;
        this.doSubmit();
    }

    doSubmit = async () => {
        document.getElementById('closeButton').click();
        try {
            const response = await axios.put('http://localhost:9000/api/quiz1/updateQuestion', this.state.item);
            localStorage.setItem('updated','true');
            window.location = "/admin/questions";
        } catch (error) {
            console.log('error----',error.response);
            toast.error("Invalid Details");
        }

    }

    seeData = () => {
        console.log(this.state.item);
    }
    
    render() { 
        const {  option1, option2, option3, option4 } = this.state.item;
        //console.log('props--',this.props.item);
        return ( 
            <React.Fragment>
                <ToastContainer />
                <button onClick={this.seeData}>Click</button>
                {/* <!-- Button trigger modal --> */}
                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal" >
                Edit
                </button>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Question</h5>
                            <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form className="container w-100 " onSubmit={this.handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Question</label>
                                    <input name="question" type="text" className="form-control" id="exampleInputQuestion1" value={this.state.item.question} onChange={this.onChange} />
                                </div>
                                {this.state.error.question && <div className="alert alert-danger my-2">{this.state.error.question}</div>}
                                <div className="form-group">
                                    <label>Option 1</label>
                                    <input name="option1" type="text" className="form-control" id="exampleInputOption1" value={option1} onChange={this.onChange}/>
                                </div>
                                {this.state.error.option1 && <div className="alert alert-danger my-2">{this.state.error.option1}</div>}
                                <div className="form-group">
                                    <label>Option 2</label>
                                    <input name="option2" type="text" className="form-control" id="exampleInputOption2" value={option2} onChange={this.onChange}/>
                                </div>
                                {this.state.error.option2 && <div className="alert alert-danger my-2">{this.state.error.option2}</div>}
                                <div className="form-group">
                                    <label>Option 3</label>
                                    <input name="option3" type="text" className="form-control" id="exampleInputOption3" value={option3} onChange={this.onChange}/>
                                </div>
                                {this.state.error.option3 && <div className="alert alert-danger my-2">{this.state.error.option3}</div>}
                                <div className="form-group">
                                    <label>Option 4</label>
                                    <input name="option4" type="text" className="form-control" id="exampleInputOption4" value={option4} onChange={this.onChange}/>
                                </div>
                                {this.state.error.option4 && <div className="alert alert-danger my-2">{this.state.error.option4}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Reset</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </React.Fragment>
         );
    }
}

export default UpdateQuestionModal;
