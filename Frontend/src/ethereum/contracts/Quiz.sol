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
}

contract Quiz{
    
    EIP20 instanceEIP20;
    
    enum Stage {Init, Reg, Play, Pub, End}
    Stage public stage;
    //uint startTime;
    uint[] public answers;
    mapping( address => bool) public user;     // Stores all the registered users, assigning them true value
    
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
    
    function registerUser() public validStage(Stage.Reg) {
        require(user[msg.sender] == false);
        user[msg.sender] = true;
    }
    
    function isUserRegistered() public view validStage(Stage.Play) returns (bool) {
        if(user[msg.sender] == true)
            return true;
        else
            return false;
    }
    
    function claimPrize(uint correctAnswers) public returns (bool) {         // function for user to claim prize coins
        require(user[msg.sender]==true);
        uint coins = (correctAnswers*3)/2;
        return instanceEIP20.transfer(msg.sender, coins);
    }
    
    function destroyContract(address payable transferAddress) public isManager validStage(Stage.End) {
        address contractAddress = address(this);
        instanceEIP20.transfer(msg.sender, instanceEIP20.balanceOf(contractAddress));
        selfdestruct(transferAddress);  
    }
    
}