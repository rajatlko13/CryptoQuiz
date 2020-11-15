//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

abstract contract EIP20 {
    uint256 public totalSupply;

    function balanceOf(address _owner) public view virtual returns (uint256 balance);

    function transfer(address _to, uint256 _value) public virtual returns (bool success);
}

contract QuizFactory {
                
    EIP20 instanceEIP20;
    mapping ( string => address ) public deployedQuizzes;
    
    constructor(address addressEIP20) {
        instanceEIP20 = EIP20(addressEIP20);
    }
    
    function createQuiz(address addressEIP20, string memory quizId) public returns (address) {
        address owner = msg.sender;
        Quiz newQuiz = new Quiz(addressEIP20, owner);
        deployedQuizzes[quizId] = address(newQuiz);
        return deployedQuizzes[quizId];
    }
    
    function getDeployedQuizzes(string memory quizId) public view returns (address) {
        return deployedQuizzes[quizId];
    }
    
    function purchaseCoins(uint coins) public payable returns (bool){        // function for user to buy coins
        require(msg.value == coins*0.01 ether);
        return instanceEIP20.transfer(msg.sender, coins);
    }
    
    function convertCoinsToEther(uint coins) public {
        require(instanceEIP20.balanceOf(msg.sender) >= coins);
        (msg.sender).transfer(coins*0.01 ether);
    }
    
    receive() external payable {
    }
}

contract Quiz{
    
    EIP20 instanceEIP20;
    
    struct User {
        bool isRegistered;
        bool quizCompleted;
        bool prizeClaimed;
        uint[] ans;
    }
    
    mapping (string => User) public users;              // Stores all the registered users
    
    uint public totalRegUsers;                     // Stores the count of registered users
    
    enum Stage {Init, Reg, Play, Pub, End}
    Stage public stage;
    
    uint[] public answers;
    
    address public manager;
    
    modifier isManager(){
        require(msg.sender == manager);
        _;
    }
    
    modifier validStage(Stage reqStage) {
        require(stage == reqStage);
        _;
    }
    
    constructor(address addressEIP20, address owner) {
        instanceEIP20 = EIP20(addressEIP20);
        manager = owner;
        stage = Stage.Init;
    }
    
    function getQuizBalance() public view returns (uint) {          //function to return the Quiz Contract balance
        return address(this).balance;
    }
    
    function startReg() public isManager validStage(Stage.Init) {
        stage = Stage.Reg;
    }
    
    function startQuiz() public isManager validStage(Stage.Reg) {
        stage = Stage.Play;
    }
    
    function endQuiz() public isManager validStage(Stage.Play) {
        stage = Stage.Pub;
    }
    
    function publishAnswers(uint[] memory answerKey) public isManager validStage(Stage.Pub) {
        answers = answerKey;
        stage = Stage.End;
    }
    
    function getAnswerKey() public view validStage(Stage.End) returns (uint[] memory) {
        return answers;
    }
    
    function getStage() public view returns (uint) {
        if(stage == Stage.Init)
            return 0;
            
        else if(stage == Stage.Reg)
            return 1;
        
        else if(stage == Stage.Play)
            return 2;
        
        else if(stage == Stage.Pub)
            return 3;
        
        else 
            return 4;
    }
    
    function registerUser(string memory email) public validStage(Stage.Reg) {
        require(users[email].isRegistered == false);
        users[email].isRegistered = true;
        users[email].quizCompleted = false;
        users[email].prizeClaimed = false;
        ++totalRegUsers;
    }
    
    function isUserRegistered(string memory email) public view returns (bool) {
        return users[email].isRegistered;
    }
    
    function setUserAnswers(string memory email, uint[] memory userAnswers) public validStage(Stage.Play) {
        require(users[email].isRegistered == true && users[email].quizCompleted == false);
        users[email].ans = userAnswers;
        users[email].quizCompleted = true;
    }
    
    function isQuizAttempted(string memory email) public view returns (bool) {
        return users[email].quizCompleted;
    }
    
    function getUserAnswers(string memory email) public view returns (uint[] memory) {
        return users[email].ans;
    }
    
    function claimPrize(string memory email, uint correctAnswers) public validStage(Stage.End) returns (bool) {         // function for user to claim prize coins
        require(users[email].quizCompleted == true && users[email].prizeClaimed == false);
        uint coins = (correctAnswers*3)/2;
        bool res = instanceEIP20.transfer(msg.sender, coins);
        users[email].prizeClaimed = true;
        return res;
    }
    
    function isPrizeClaimed(string memory email) public view returns (bool) {
        return users[email].prizeClaimed;
    }
    
    function destroyContract(address payable transferAddress) public isManager validStage(Stage.End) {
        address contractAddress = address(this);
        instanceEIP20.transfer(msg.sender, instanceEIP20.balanceOf(contractAddress));
        selfdestruct(transferAddress);  
    }
    
}