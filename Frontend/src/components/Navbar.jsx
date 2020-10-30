import React, { Component } from 'react';
import {Link, NavLink} from 'react-router-dom';
import VerifyAuthentication from '../utilities/verifyAuthentication';

class Navbar extends Component {
    state = { 
        admin: '',
        user: ''
     }

    componentDidMount() {
        const admin = VerifyAuthentication.isAdminAuthenticated();
        const user = VerifyAuthentication.isUserAuthenticated();
        this.setState({ admin, user });
    }

    render() { 

        const { admin, user } = this.state;

        return ( 
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-white">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">CryptoQuiz</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link" aria-current="page" to="/home">Home</NavLink>
                        <NavLink className="nav-link" to="/features">Features</NavLink>
                        <NavLink className="nav-link" to="/pricing">Pricing</NavLink>
                        { !admin && !user &&
                        <React.Fragment>
                            <NavLink className="nav-link" to="/adminLogin">Admin Login</NavLink> 
                            <NavLink className="nav-link" to="/registration">Registration</NavLink>
                            <NavLink className="nav-link" to="/login">User Login</NavLink>
                        </React.Fragment> }
                        { admin && 
                        <React.Fragment>
                            <NavLink className="nav-link" to="/quizPageAdmin">QuizPageAdmin</NavLink>
                            <NavLink className="nav-link" to="/logout">Logout</NavLink>
                        </React.Fragment> }
                        { user && 
                        <React.Fragment>
                            <NavLink className="nav-link" to="/userPage1">UserPage1</NavLink>
                            <NavLink className="nav-link" to="/quizPageUser">Quizzes</NavLink>
                            <NavLink className="nav-link" to="/userCoins">QuizCoins</NavLink>
                            <NavLink className="nav-link" to="/logout">Logout</NavLink>
                        </React.Fragment> }
                    </div>
                    </div>
                </div>
            </nav>
         );
    }
}
 
export default Navbar;