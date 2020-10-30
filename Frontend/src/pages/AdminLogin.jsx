import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Joi from 'joi-browser';
import 'react-toastify/dist/ReactToastify.css';

class AdminLogin extends Component {
    
    state = { 
        admin: {
            email: '',
            password: ''
        },
        error: {}
    };

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password')
    }

    validate = () => {
        const { error } = Joi.validate(this.state.admin, this.schema);
        if(!error) 
            return null;
        
        const errors = {};
        for(let item of error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    validateProperty = (name, value) => {
        const schema1 = {
            [name]: this.schema[name]
        }
        const obj = {
            [name]: value
        }
        const {error} = Joi.validate(obj, schema1);
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
        const admin = {...this.state.admin};
        admin[name] = value;
        this.setState({ admin, error});
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
        try {
            const response = await axios.post('http://localhost:9000/api/admin/login', this.state.admin);
    
            const { data } = response;
            console.log(data.token);
            localStorage.setItem('token', data.token);
            const admin = {
                email: '',
                password: ''
            };
            this.setState({admin});
            window.location = '/';
        } catch (error) {
            console.log('error----',error.response);
            //const {data} = error.response;
            if(error.response && error.response.status === 400)
                toast.error("Invalid Details");
            if(error.response && error.response.status === 401)
                toast.error("Wrong Password");
        }
    
    }

    render() { 
        return ( 
            <React.Fragment>
                <ToastContainer />
                <h5 className="mx-2 my-2">Admin Login Form</h5>
                <form className="container w-25 " style={{float:"left"}}  onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={this.state.admin.email} onChange={this.onChange} />
                    </div>
                    {this.state.error.email && <div className="alert alert-danger my-2">{this.state.error.email}</div>}
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" className="form-control" id="exampleInputPassword1" value={this.state.admin.password} onChange={this.onChange}/>
                    </div>
                    {this.state.error.password && <div className="alert alert-danger my-2">{this.state.error.password}</div>}

                    <button type="submit" className="btn btn-primary my-2">Submit</button>
                </form>
            </React.Fragment>
         );
    }
}
 
export default AdminLogin;