import React, { Component } from 'react';
import axios from 'axios';

class Features extends Component {
    
    state = {
        users : []
    }

    async componentDidMount() {
        const users = await axios.get('http://localhost:9000/api/user');
        console.log(users.data);
        this.setState({users : users.data});
    }

    printUsers = () => {
        const userList = this.state.users.map((user,index) => 
            <li key={index}>{index} | {user.name} | {user._id}</li>
        );
        return userList;
    }

    render() { 
        return ( 
            <React.Fragment>
                <h3 className="mx-2 my-2 danger">Welcome to Features Page</h3>
                <ul>
                    {this.printUsers()}
                </ul>
            </React.Fragment>
         );
    }
}
 
export default Features;