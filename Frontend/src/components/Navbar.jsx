import React, { Component } from 'react';
import {Link, NavLink} from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import jwtDecode from 'jwt-decode';
import VerifyAuthentication from '../utilities/verifyAuthentication';
import Logo from '../images/logo';

class Navbar extends Component {
    state = { 
        admin: '',
        user: '',
        username: ''
     }

    componentDidMount() {
        const admin = VerifyAuthentication.isAdminAuthenticated();
        const user = VerifyAuthentication.isUserAuthenticated();
        this.setState({ admin, user });
        try {
            const { email } = jwtDecode(localStorage.getItem('token'));
            let username;
            if(admin)
                username = 'Admin';
            else if(user)
                username = email;
            this.setState({ username });
        } catch (error) {
        }
    }

    render() { 

        const { admin, user } = this.state;
        
        return ( 
            <nav className="navbar navbar-expand-lg navbar-dark text-white"  style={{fontFamily: 'Goldman', fontSize: '15px'}}>
                <div className="container-fluid">
                    <Link className="navbar-brand mr-5" to="/" style={{fontSize: '30px'}}>CryptoQuiz<Logo width="50px" /></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link" aria-current="page" to="/home">Home</NavLink>
                        { !admin && !user &&
                        <React.Fragment>
                            <NavLink className="nav-link" to="/adminLogin">Admin Login</NavLink> 
                            <NavLink className="nav-link" to="/registration">Registration</NavLink>
                            <NavLink className="nav-link" to="/login">User Login</NavLink>
                        </React.Fragment> }
                        { admin && 
                        <React.Fragment>
                            <NavLink className="nav-link" to="/quizPageAdmin">Quizzes</NavLink>
                            <span style={{position: 'absolute' , right: '2vw'}}>
                                <span className='mr-3'>Welcome { this.state.username }</span>
                                <Link to="/logout">
                                    <Button inverted color="red" style={{fontFamily: 'Goldman'}}>Logout</Button>
                                </Link>
                            </span>
                        </React.Fragment> }
                        { user && 
                        <React.Fragment>
                            <NavLink className="nav-link" to="/quizPageUser">Quizzes</NavLink>
                            <NavLink className="nav-link" to="/userCoins">QuizCoins</NavLink>
                            <span style={{position: 'absolute' , right: '2vw'}}>
                                <span className='mr-3'>Welcome { this.state.username }</span>
                                <Link to="/logout">
                                    <Button inverted color="red" style={{fontFamily: 'Goldman'}}>Logout</Button>
                                </Link>
                            </span>
                        </React.Fragment> }
                    </div>
                    </div>
                </div>
            </nav>
         );
    }
}
 
export default Navbar;