import React, { Component } from 'react';
import Joi from 'joi-browser';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import web3 from './ethereum/web3';
import instanceEIP20 from './ethereum/instanceEIP20';
import buildEIP20 from './ethereum/build/buildEIP20/EIP20.json';

class Pricing extends Component {

    state = {
        account: '',
        balance: '',
        transferAddress: '',
        transferAmount: '',
        loading: false,
        disabled: false
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const balance = await instanceEIP20.methods.balanceOf(accounts[0]).call();
        const symbol = await instanceEIP20.methods.symbol().call();
        console.log('symbol--',symbol);

        this.setState({account: accounts[0], balance});
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({ [name]: value});
    }

    doSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, disabled: true });
        
        const { account, transferAddress, transferAmount } = this.state;
        try {
            console.log('Transaction initiated');
            const result = await instanceEIP20.methods.transfer(transferAddress, transferAmount)
                            .send({from: account});

            console.log('Transaction done');
            this.setState({transferAddress: '', transferAmount: '' });
            toast.success("Transaction Successful!");
        } catch (error) {
            console.log('Transaction failed',error);
            toast.error("Transaction Failed!");
        }
        const balance = await instanceEIP20.methods.balanceOf(account).call();
        this.setState({ balance, loading: false, disabled: false });
    }

    render() { 
        return ( 
            <div className="mx-2 my-2">
                <ToastContainer/>
                <h3>Welcome to Pricing Page</h3>
                <h5>Account {this.state.account} has {this.state.balance} QC.</h5>

                <form onSubmit={this.doSubmit}>
                    Transfer Amount : <input name="transferAmount" type="number" value={this.state.transferAmount} onChange={this.onChange}/>
                    <br/>
                    Transfer Address : <input name="transferAddress" type="text" value={this.state.transferAddress} onChange={this.onChange}/>
                    <br/>
                    <Button loading={this.state.loading} primary disabled={this.state.disabled}>Transfer</Button>
                </form>
            </div>
         );
    }
}
 
export default Pricing;