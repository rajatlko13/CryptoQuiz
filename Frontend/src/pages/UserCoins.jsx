import React, { Component } from 'react';
import web3 from '../ethereum/web3';
import instanceEIP20 from '../ethereum/instanceEIP20';
import instanceQuizFactory from '../ethereum/instanceQuizFactory';
import { addressQuizFactory } from '../ethereum/addressConfig.json';
import { Button, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { ToastContainer, toast } from 'react-toastify';

class UserCoins extends Component {
    state = {
        account: '', 
        balance: '',
        coins: '',
        loading: false,
        disabled: false
     }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const balance = await instanceEIP20.methods.balanceOf(accounts[1]).call();
        this.setState({ account: accounts[1], balance });
    }

    onChange = (e) => {
        const val = e.target.value;
        this.setState({ coins: val });
    }

    purchaseCoins = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, disabled: true });
        try {
            const amount = 0.01 * this.state.coins;
            const res = await instanceQuizFactory.methods.purchaseCoins(this.state.coins)
                        .send({ from: this.state.account, value: web3.utils.toWei(String(amount), 'ether')});
            const balance = parseInt(this.state.balance) + parseInt(this.state.coins);
            toast.success("QuizCoins Purchase Successful!");
            this.setState({ coins: '', balance, loading: false, disabled: false });
        } catch (error) {
            console.log("error--",error);
            toast.error("Transaction Failed!");
            this.setState({ loading: false, disabled: false });
        }
    }

    render() { 
        return (
            <div className="container text-center mt-4">
                <ToastContainer/>
                <h1>My QuizCoins</h1>
                <h2>Account : {this.state.account}</h2>
                <h2>Balance : {this.state.balance} QC</h2>
                <form className="my-4" onSubmit={this.purchaseCoins}>
                    <Input type="number" min='0' className="mx-2" value={this.state.coins} onChange={this.onChange} disabled={this.state.disabled} />
                    <Button size="small" color="green" loading={this.state.loading} disabled={this.state.disabled} >Buy QuizCoins</Button>
                </form>
                <span>{this.state.coins? <h5>Cost : {this.state.coins * 0.01} ethers </h5> : null }</span>
            </div>
          );
    }
}
 
export default UserCoins;