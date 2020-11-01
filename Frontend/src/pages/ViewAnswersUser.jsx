import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

class ViewAnswersUser extends Component {
    //state = {  }
    render() { 
        return ( 
            <div className="container">
                <h3>View Answers</h3>
                <Table celled color='black' striped selectable inverted textAlign="center" verticalAlign="middle" unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Question</Table.HeaderCell>
                            <Table.HeaderCell>Option 1</Table.HeaderCell>
                            <Table.HeaderCell>Option 2</Table.HeaderCell>
                            <Table.HeaderCell>Option 3</Table.HeaderCell>
                            <Table.HeaderCell>Option 4</Table.HeaderCell>
                            <Table.HeaderCell>Correct Answer</Table.HeaderCell>
                            <Table.HeaderCell>Your Answer</Table.HeaderCell>
                            <Table.HeaderCell>Result</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderQuestions()}
                    </Table.Body>
                </Table>
            </div>
         );
    }
}
 
export default ViewAnswersUser;