import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import VerifyAuthentication from './utilities/verifyAuthentication';

class Home extends Component {

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
        const { user, admin } = this.state;

        return ( 
            <div className="container text-center text-white" style={{textAlign: 'center', fontFamily: 'Goldman', marginTop: '10%'}}>
                <p style={{ margin: '0', padding: '0', fontSize: '6vw', lineHeight: '1em', textShadow: '2px 2px 7px blue'}}>Learn More</p>
                <p style={{ margin: '0', padding:'0', fontSize: '6vw', lineHeight: '1em', textShadow: '2px 2px 7px blue'}}>Earn More</p>
                <p className="mt-2">Let your knowledge earn you some cryptos</p>
                <hr className="w-25 mx-auto" />
                { !user && !admin && 
                <div>
                    <Link to="/registration"><button className="btn btn-outline-primary mr-3 border-3" style={{fontFamily: 'Goldman'}}>Register</button></Link>
                    <Link to="/login"><button className="btn btn-outline-warning ml-2 border-3" style={{fontFamily: 'Goldman'}}>Login</button></Link>
                </div>
                }
            </div>

         );
    }
}
 
export default Home;