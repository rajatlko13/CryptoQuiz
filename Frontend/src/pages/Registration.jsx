import React, { Component } from 'react';
import axios from 'axios';
import Joi from 'joi-browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'semantic-ui-react';
import RegisterUserSvg from '../images/registerUserSvg';

class Registration extends Component {
    state = { 
        user: {
            name: '',
            age: '',
            email: '',
            password: ''
        },
        error: {}
    }

    schema = {
        name: Joi.string().required().label('Name'),
        age: Joi.number().min(0).required().label('Age'),
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password')
    };

    validate = () => {
        const { error } = Joi.validate(this.state.user, this.schema, { abortEarly : false });
        if(!error)
            return;

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
        const { error } = Joi.validate(obj, schema);
        return error? error.details[0].message : null;
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        const error = {...this.state.error};
        const errorMessage = this.validateProperty(name, value);
        if(errorMessage)
            error[name] = errorMessage;
        else
            delete error[name];

        const user = {...this.state.user};
        user[name] = value;
        this.setState({ user, error });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ error: errors || {} });
        if(errors)  return;
        this.doSubmit();
    }

    doSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:9000/api/user/new', this.state.user);
            console.log('response---',response);
            toast.success("Registration Successful");
            const user = {
                name: '',
                age: '',
                email: '',
                password: ''
            };
            this.setState({user});
        } catch (error) {
            console.log('error----',error.response);
            //const {data} = error.response;
            if(error.response && error.response.status === 400)
                toast.error("Email already registered!");
            
        }
        
    }

    render() { 
        return ( 
            <React.Fragment>
                <ToastContainer />
                <div className="container" style={{marginTop: '10vh', marginBottom: '10vh'}}>
                    <div className="row mx-auto" style={{ width: '700px', boxShadow: '7px 7px 15px yellow'}}>
                        <div className="col-lg-4 bg-secondary p-2" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div className="mx-auto">
                                <RegisterUserSvg width="150px" />
                            </div>
                        </div>
                        <div className="col-lg-8 bg-dark" style={{color: 'yellow', fontFamily: 'Goldman'}}>
                            <h3 className="text-center mt-4 mb-0 pb-0" style={{fontFamily: 'Goldman'}}>Registration Form</h3>
                            <hr className=" mx-auto w-25" />
                            <form onSubmit={this.handleSubmit} className="px-5 pb-4 pt-0">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input name="name" type="text" className="form-control" id="exampleInputName1" value={this.state.user.name} onChange={this.onChange} />
                                </div>
                                {this.state.error.name && <div className="my-2 font-weight-bold" style={{color: 'red'}}>{this.state.error.name}</div>}
                                <div className="form-group mt-2">
                                    <label>Age</label>
                                    <input name="age" type="number" className="form-control" id="exampleInputAge1" value={this.state.user.age} onChange={this.onChange} />
                                </div>
                                {this.state.error.age && <div className="my-2 font-weight-bold" style={{color: 'red'}}>{this.state.error.age}</div>}
                                <div className="form-group mt-2">
                                    <label>Email address</label>
                                    <input name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={this.state.user.email} onChange={this.onChange} />
                                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                {this.state.error.email && <div className="my-2 font-weight-bold" style={{color: 'red'}}>{this.state.error.email}</div>}
                                <div className="form-group mt-2">
                                    <label>Password</label>
                                    <input name="password" type="password" className="form-control" id="exampleInputPassword1" value={this.state.user.password} onChange={this.onChange}/>
                                </div>
                                {this.state.error.password && <div className="my-2 font-weight-bold" style={{color: 'red'}}>{this.state.error.password}</div>}
                                
                                <Button type="submit" className="my-3" inverted color='yellow'>Register</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default Registration;