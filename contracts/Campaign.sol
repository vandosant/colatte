contract Campaign {
    struct Request {
        string description;
        address recipient;
        uint value;
        bool completed;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint approversCount;
    mapping(address => bool) public approvers;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum) public {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient)
        public restricted
    {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           completed: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }
    
    function approveRequest(uint requestIndex) public {
        Request storage request = requests[requestIndex];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestIndex) private {
        Request storage request = requests[requestIndex];
        require(!request.completed);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.completed = true;
    }
}