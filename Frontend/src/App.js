import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Features from './Features';
import Pricing from './Pricing';
import Home from './Home';
import Registration from './pages/Registration';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import QuizPageAdmin from './pages/QuizPageAdmin';
import QuestionsAdmin from './pages/QuestionsAdmin';
import EditQuestion from './pages/EditQuestion';
import NewQuizPage from './pages/NewQuizPage';
import NewQuestionPage from './pages/NewQuestionPage';
import PublishAnswersPage from './pages/PublishAnswersPage';
import UserPage1 from './pages/UserPage1';
import UserCoins from './pages/UserCoins';
import QuizPageUser from './pages/QuizPageUser';
import QuestionsUser from './pages/QuestionsUser';
import AttemptQuiz from './pages/AttemptQuiz';
import ViewAnswersUser from './pages/ViewAnswersUser';
import Logout from './pages/Logout';
import Navbar from './components/Navbar';
import ProtectedRoute from './utilities/ProtectedRoute';
import VerifyAuthentication from './utilities/verifyAuthentication';
import NotFoundPage from './pages/NotFoundPage';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { 
    role: ''
   }

  componentDidMount() {
    const role = VerifyAuthentication.isAdminAuthenticated()? "admin" : ( VerifyAuthentication.isUserAuthenticated()? "user" : '');
    this.setState({ role });
  }

  render() { 
    return ( 
      <React.Fragment>
        <Navbar />
        <Switch>
            <Route path="/home" component={Home} />
            <Route path="/features" component={Features} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/adminLogin" component={AdminLogin} />
            <ProtectedRoute path="/quizPageAdmin" component={QuizPageAdmin} role="admin" {...this.props} />
            <ProtectedRoute path="/admin/quiz/:id" component={QuestionsAdmin} role="admin" {...this.props} />
            <ProtectedRoute path="/admin/question/edit/:id" component={EditQuestion} role="admin" {...this.props} />
            <ProtectedRoute path="/admin/newQuiz" component={NewQuizPage} role="admin" {...this.props} />
            <ProtectedRoute path="/admin/newQuestion/:id" component={NewQuestionPage} role="admin" {...this.props} />
            <ProtectedRoute path="/admin/publishAnswers/:id" component={PublishAnswersPage} role="admin" {...this.props} />
            {/* <ProtectedRoute path="/userPage1" render={(props) => <UserPage1 role="user" {...props} /> } />
            <ProtectedRoute path="/quizPageAdmin" render={(props) => <QuizPageAdmin role="admin" {...props} /> } /> */}
            <ProtectedRoute path="/userPage1" component={UserPage1} role="user" {...this.props} />
            <ProtectedRoute path="/userCoins" component={UserCoins} role="user" {...this.props} />
            <ProtectedRoute path="/quizPageUser" component={QuizPageUser} role="user" {...this.props} />
            <ProtectedRoute path="/user/quiz/:id" component={QuestionsUser} role="user" {...this.props} />
            <ProtectedRoute path="/user/attemptQuiz/:id" component={AttemptQuiz} role="user" {...this.props} />
            <ProtectedRoute path="/user/viewAnswers/:id" component={ViewAnswersUser} role="user" {...this.props} />
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/logout" component={Logout} />
            <Route path="/:page" component={NotFoundPage} />
            <Route path="/" component={Home} />
            <Redirect to="/:page"/>
        </Switch>
      </React.Fragment>
     );
  }
}
 
export default App;

// function App() {
//   return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    
//   );
// }

// export default App;
